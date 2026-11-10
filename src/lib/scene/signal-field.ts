// 📖 Docs: obsidian/frontend/components/portfolio.md → "The hero scene"

import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

import { createDrawGate, createFrameClock, perFrame } from "@/lib/scene/per-frame";

/**
 * The hero scene: a field of bars — readings, checks, signal — that swells
 * where the pointer is. One instanced draw call; the heights are computed in
 * the vertex shader, so a frame costs the CPU a few uniforms.
 *
 * Quality is data: the same field with fewer bars and pixels on a weaker
 * device. If the measured frame rate stays low the scene lowers its own cost
 * (pixel ratio first, then bars) and, at the floor, reports `onSlow` so the
 * caller can show the still.
 *
 * Context loss is the caller's job: `hero-scene.tsx` builds this through
 * `keepSceneAlive` and wires `watchContext` to `canvas` (rebuilt on a fresh
 * context, released on every teardown).
 */

export interface SceneQuality {
  /** Bars per side. */
  grid: number;
  /** The most device pixels per CSS pixel the scene will draw. */
  maxDpr: number;
  /** Floating specks above the field (0 = none). */
  particles: number;
  /** Gate the draw at ~60 fps (desktop on 120 Hz panels — never phones). */
  gateDraw: boolean;
  /** React to the mouse; otherwise the swell wanders on its own. */
  pointer: boolean;
}

export interface SceneColors {
  ground: string;
  ink: string;
  accent: string;
}

export interface SignalField {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  frameCount(): number;
  setColors(colors: SceneColors): void;
  dispose(): void;
}

export interface SignalFieldOptions {
  quality: SceneQuality;
  colors: SceneColors;
  /** The scene is at its cheapest and still slow. */
  onSlow?: () => void;
}

const SLOW_FPS = 40;
const SAMPLE_SECONDS = 2;
const MIN_DPR = 1;
const MIN_BARS = 0.4;

const FIELD_VERTEX = /* glsl */ `
  attribute vec2 aCell;
  attribute float aSeed;
  uniform float uTime;
  uniform vec3 uPointer;
  uniform float uScroll;
  varying vec3 vNormal;
  varying float vHeight;
  varying float vNear;
  varying float vDepth;

  void main() {
    float wave = sin(aCell.x * 0.55 + uTime * 0.9) * 0.5
      + sin(aCell.y * 0.4 - uTime * 0.6) * 0.5
      + sin((aCell.x + aCell.y) * 0.25 + uTime * 0.35);
    float near = smoothstep(5.0, 0.0, distance(aCell, uPointer.xy)) * uPointer.z;
    float height = 0.2 + (wave * 0.25 + 0.5) * 1.5 + aSeed * 0.6 + near * 3.4;
    height *= mix(1.0, 0.3, uScroll);

    vec3 p = position;
    p.xz *= 0.6;
    p.y = (p.y + 0.5) * height;
    p.xz += aCell;

    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vNormal = normal;
    vHeight = p.y;
    vNear = near;
    vDepth = -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const FIELD_FRAGMENT = /* glsl */ `
  uniform vec3 uGround;
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform vec2 uFade;
  varying vec3 vNormal;
  varying float vHeight;
  varying float vNear;
  varying float vDepth;

  void main() {
    float top = step(0.5, vNormal.y);
    float side = abs(vNormal.x) > 0.5 ? 0.5 : 0.28;
    float shade = mix(side, 1.0, top);
    // The moving texture: bands climbing the sides of every bar.
    float band = step(0.5, fract(vHeight * 2.5 - uTime * 0.5));
    shade *= mix(1.0, 0.6, band * (1.0 - top));

    vec3 color = mix(uGround, uInk, 0.05 + shade * 0.2);
    color = mix(color, uAccent, clamp(vNear * (0.35 + shade * 0.75), 0.0, 1.0));
    float fade = smoothstep(uFade.y, uFade.x, vDepth);
    gl_FragColor = vec4(mix(uGround, color, fade), 1.0);
  }
`;

const SPECK_VERTEX = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uSize;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.25 + aSeed * 0.5), 9.0);
    p.x += sin(uTime * 0.4 + aSeed * 40.0) * 0.4;
    vec4 view = modelViewMatrix * vec4(p, 1.0);
    vAlpha = smoothstep(9.0, 6.0, p.y) * smoothstep(0.0, 1.5, p.y);
    gl_PointSize = uSize * (0.5 + aSeed) / -view.z;
    gl_Position = projectionMatrix * view;
  }
`;

const SPECK_FRAGMENT = /* glsl */ `
  uniform vec3 uInk;
  varying float vAlpha;

  void main() {
    gl_FragColor = vec4(uInk, vAlpha * 0.55);
  }
`;

/** A stable pseudo-random number in [0, 1) for a cell. */
const seedOf = (x: number, z: number): number => {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

const buildField = (grid: number) => {
  // Centre-out, so lowering `instanceCount` shrinks the field's edge.
  const cells: { x: number; z: number }[] = [];
  const half = (grid - 1) / 2;
  for (let ix = 0; ix < grid; ix += 1) {
    for (let iz = 0; iz < grid; iz += 1) cells.push({ x: ix - half, z: iz - half });
  }
  cells.sort((a, b) => a.x * a.x + a.z * a.z - (b.x * b.x + b.z * b.z));

  const box = new BoxGeometry(1, 1, 1);
  const geometry = new InstancedBufferGeometry();
  geometry.index = box.index;
  geometry.setAttribute("position", box.getAttribute("position"));
  geometry.setAttribute("normal", box.getAttribute("normal"));
  const cell = new Float32Array(cells.length * 2);
  const seed = new Float32Array(cells.length);
  cells.forEach(({ x, z }, index) => {
    cell[index * 2] = x;
    cell[index * 2 + 1] = z;
    seed[index] = seedOf(x, z);
  });
  geometry.setAttribute("aCell", new InstancedBufferAttribute(cell, 2));
  geometry.setAttribute("aSeed", new InstancedBufferAttribute(seed, 1));
  geometry.instanceCount = cells.length;
  return { geometry, box, count: cells.length };
};

const buildSpecks = (count: number, spread: number) => {
  const geometry = new BufferGeometry();
  const position = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let index = 0; index < count; index += 1) {
    position[index * 3] = (seedOf(index, 1) - 0.5) * spread;
    position[index * 3 + 1] = seedOf(index, 2) * 9;
    position[index * 3 + 2] = (seedOf(index, 3) - 0.5) * spread;
    seed[index] = seedOf(index, 4);
  }
  geometry.setAttribute("position", new BufferAttribute(position, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  return geometry;
};

export function createSignalField(
  container: HTMLElement,
  { quality, colors, onSlow }: SignalFieldOptions,
): SignalField {
  const renderer = new WebGLRenderer({
    antialias: quality.maxDpr <= 1.5,
    alpha: false,
    powerPreference: "high-performance",
  });
  const canvas = renderer.domElement;
  canvas.className = "block size-full";
  canvas.setAttribute("aria-hidden", "true");
  container.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 120);
  const half = quality.grid / 2;

  const ground = new Color(colors.ground);
  const ink = new Color(colors.ink);
  const accent = new Color(colors.accent);
  renderer.setClearColor(ground, 1);

  const field = buildField(quality.grid);
  const fieldMaterial = new ShaderMaterial({
    vertexShader: FIELD_VERTEX,
    fragmentShader: FIELD_FRAGMENT,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new Vector3(0, 0, 0) },
      uScroll: { value: 0 },
      uGround: { value: ground },
      uInk: { value: ink },
      uAccent: { value: accent },
      uFade: { value: new Vector2(1, 2) },
    },
  });
  const mesh = new Mesh(field.geometry, fieldMaterial);
  // Bounds are computed for one box; the instances spread far beyond it.
  mesh.frustumCulled = false;
  scene.add(mesh);

  let specks: Points | null = null;
  let speckMaterial: ShaderMaterial | null = null;
  if (quality.particles > 0) {
    speckMaterial = new ShaderMaterial({
      vertexShader: SPECK_VERTEX,
      fragmentShader: SPECK_FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uSize: { value: 60 }, uInk: { value: ink } },
    });
    specks = new Points(buildSpecks(quality.particles, quality.grid), speckMaterial);
    specks.frustumCulled = false;
    scene.add(specks);
  }

  // --- size -----------------------------------------------------------------
  let dpr = Math.min(window.devicePixelRatio || 1, quality.maxDpr);
  let cssWidth = 0;
  let cssHeight = 0;
  let appliedDpr = 0;

  const frameCamera = () => {
    const aspect = cssWidth / Math.max(1, cssHeight);
    const wide = aspect >= 1;
    camera.aspect = aspect;
    // Wide: the camera looks left of centre, so the field sits to the right of
    // the name. Tall (a phone): centred, further back so the field still reads.
    const centre = wide ? -half * 0.5 : 0;
    const height = half * (wide ? 1.05 : 1.5);
    const back = half * (wide ? 1.75 : 2.6);
    camera.position.set(centre, height, back);
    camera.lookAt(centre, 0, half * 0.15);
    camera.updateProjectionMatrix();
    const distance = Math.hypot(height, back);
    (fieldMaterial.uniforms.uFade.value as Vector2).set(distance * 0.75, distance * 1.75);
  };

  /** Resize only on a real change, and draw at once after it (blank buffer). */
  const resize = (): boolean => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return false;
    if (width === cssWidth && height === cssHeight && dpr === appliedDpr) return false;
    cssWidth = width;
    cssHeight = height;
    appliedDpr = dpr;
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    if (speckMaterial) speckMaterial.uniforms.uSize.value = height * 0.09 * dpr;
    frameCamera();
    return true;
  };

  // --- pointer --------------------------------------------------------------
  const raycaster = new Raycaster();
  const floor = new Plane(new Vector3(0, 1, 0), 0);
  const ndc = new Vector2();
  const hit = new Vector3();
  const pointerTarget = new Vector2(0, 0);
  let pointerActive = false;

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    pointerActive = inside;
    if (!inside) return;
    ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(floor, hit)) pointerTarget.set(hit.x, hit.z);
  };
  if (quality.pointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

  // --- scroll ---------------------------------------------------------------
  let scrollTarget = 0;
  const onScroll = () => {
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / Math.max(1, cssHeight)));
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- loop -----------------------------------------------------------------
  const clock = createFrameClock();
  const gate = createDrawGate(quality.gateDraw);
  let raf = 0;
  let running = false;
  let inView = true;
  let frames = 0;
  let disposed = false;
  let sampleTime = 0;
  let sampleFrames = 0;
  let slowSamples = 0;
  let reportedSlow = false;

  /** Pay less per frame: pixels first, then bars, then tell the caller. */
  const lowerCost = () => {
    if (dpr > MIN_DPR) {
      dpr = Math.max(MIN_DPR, dpr - 0.5);
      if (resize()) gate.force();
      return;
    }
    const floorCount = Math.floor(field.count * MIN_BARS);
    if (field.geometry.instanceCount > floorCount) {
      field.geometry.instanceCount = Math.max(
        floorCount,
        Math.floor(field.geometry.instanceCount * 0.7),
      );
      return;
    }
    if (!reportedSlow) {
      reportedSlow = true;
      onSlow?.();
    }
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const { dt, t } = clock.tick(now);

    // Easing steps every tick, scaled by dt — the same feel at 60 and 120 Hz.
    const pointer = fieldMaterial.uniforms.uPointer.value as Vector3;
    const targetX = pointerActive ? pointerTarget.x : Math.sin(t * 0.31) * half * 0.55;
    const targetZ = pointerActive ? pointerTarget.y : Math.cos(t * 0.23) * half * 0.4;
    const ease = perFrame(0.09, dt);
    pointer.x += (targetX - pointer.x) * ease;
    pointer.y += (targetZ - pointer.y) * ease;
    pointer.z += ((pointerActive ? 1 : 0.7) - pointer.z) * ease;
    const scroll = fieldMaterial.uniforms.uScroll;
    scroll.value += (scrollTarget - scroll.value) * perFrame(0.12, dt);
    fieldMaterial.uniforms.uTime.value = t;
    if (speckMaterial) speckMaterial.uniforms.uTime.value = t;
    mesh.rotation.y = scroll.value * 0.35;

    if (gate.shouldDraw(dt)) {
      renderer.render(scene, camera);
      frames += 1;
    }

    // The real frame rate, from ticks (the draw gate does not count against it).
    sampleTime += dt;
    sampleFrames += 1;
    if (sampleTime >= SAMPLE_SECONDS) {
      const fps = sampleFrames / sampleTime;
      slowSamples = fps < SLOW_FPS ? slowSamples + 1 : 0;
      sampleTime = 0;
      sampleFrames = 0;
      if (slowSamples >= 2) {
        slowSamples = 0;
        lowerCost();
      }
    }
  };

  const start = () => {
    if (running || disposed || !inView || document.hidden) return;
    running = true;
    clock.reset();
    sampleTime = 0;
    sampleFrames = 0;
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Paused only while off screen or in a hidden tab — never while visible.
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  });
  visibility.observe(container);
  const onVisibilityChange = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibilityChange);

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) {
      gate.force();
      renderer.render(scene, camera);
    }
  });
  resizeObserver.observe(container);

  resize();
  onScroll();
  // Compile the programs now, under the first paint, not on the first frame.
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  frames += 1;
  start();

  return {
    canvas,
    gl: renderer.getContext(),
    frameCount: () => frames,
    setColors(next) {
      ground.set(next.ground);
      ink.set(next.ink);
      accent.set(next.accent);
      renderer.setClearColor(ground, 1);
      gate.force();
    },
    dispose() {
      disposed = true;
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      field.geometry.dispose();
      field.box.dispose();
      fieldMaterial.dispose();
      specks?.geometry.dispose();
      speckMaterial?.dispose();
      renderer.dispose();
    },
  };
}
