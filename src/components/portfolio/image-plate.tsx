"use client";

// 📖 Docs: obsidian/frontend/components/portfolio.md

import { animated, useSpring } from "@react-spring/web";
import Image from "next/image";

import { useMotionOff } from "@/hooks/use-motion-off";

export interface ImagePlateProps {
  /** The project's picture. Omitted → the moving colour plate stands in. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Shown on the plate while there is no image. */
  label: string;
  /** The project's number, set large on the plate. */
  number: string;
  className?: string;
}

/**
 * Where a project's image goes. Until it has one: a flat accent plate with a
 * hatch that drifts across it (one transform — no repaint), so the slot is
 * alive and obviously waiting. Pass `image` and the picture takes its place.
 */
export const ImagePlate = ({ image, label, number, className }: ImagePlateProps) => {
  const motionOff = useMotionOff();
  // One hatch period per lap: the loop has no seam. Gated — a looping spring
  // under `skipAnimation` hangs the page.
  const drift = useSpring({
    from: { x: "0rem" },
    to: { x: "1.76777rem" },
    loop: !motionOff,
    config: { duration: 1400 },
    pause: motionOff || Boolean(image),
  });

  if (image) {
    return (
      <figure className={`relative overflow-hidden border border-foreground ${className ?? ""}`}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="size-full object-cover"
        />
      </figure>
    );
  }

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative overflow-hidden border border-foreground bg-accent text-accent-contrast ${className ?? ""}`}
    >
      <animated.div
        aria-hidden="true"
        style={drift}
        className="bg-hatch absolute -inset-x-8 inset-y-0 opacity-25"
      />
      <span
        aria-hidden="true"
        className="type-display absolute -bottom-6 right-2 text-display leading-display"
      >
        {number}
      </span>
      <span aria-hidden="true" className="type-label absolute left-3 top-3 bg-accent-contrast px-2 py-1 text-accent">
        {label}
      </span>
    </div>
  );
};
