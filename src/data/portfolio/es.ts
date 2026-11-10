import type { PortfolioContent } from "./types";

/** Spanish copy — the same shape as `en.ts`, entry for entry. */
export const es: PortfolioContent = {
  locale: "es",
  person: {
    name: "Amelia Nuñez",
    nameLines: ["Amelia", "Nuñez"],
    role: "Desarrolladora de software",
    focus: ["Full-Stack", "Móvil", "IoT"],
    intro:
      "Construyo software de principio a fin: desde el sensor en la placa hasta la API, la base de datos y la app en tu mano.",
  },
  nav: {
    label: "Principal",
    work: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
    skip: "Saltar a los proyectos",
    language: "Idioma",
    switchTo: "View in English",
    themeToDark: "Cambiar a tema oscuro",
    themeToLight: "Cambiar a tema claro",
  },
  hero: {
    cta: "Ver los proyectos",
    index: "Índice de proyectos",
    scroll: "Desliza",
    sceneAlt: "",
  },
  work: {
    title: "Proyectos destacados",
    progress: "Proyecto",
    jump: "Ir al proyecto",
    technologies: "Tecnologías",
    imageSlot: "Aquí va la imagen del proyecto",
    howItWorks: "Cómo funciona",
    screens: "Pantallas",
    cursor: "Abrir",
  },
  projects: [
    {
      id: "iot-plant-monitoring",
      name: "Monitoreo de plantas IoT",
      summary:
        "Un sistema de monitoreo de plantas: un ESP32 lee los sensores, envía las lecturas a un backend que las guarda y una app móvil las muestra.",
      technologies: [
        "ESP32",
        "Arduino",
        "React Native",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
      ],
      links: [],
      visual: "iot",
      pipeline: [
        { name: "Sensores", role: "Leen la planta" },
        { name: "ESP32", role: "Recoge y transmite" },
        { name: "Node.js", role: "Procesa los datos" },
        { name: "PostgreSQL", role: "Guarda las lecturas" },
        { name: "React Native", role: "Lo muestra en el móvil" },
      ],
    },
    {
      id: "sitetimeline",
      name: "SiteTimeline",
      summary:
        "Monitorea la disponibilidad y la latencia de tus sitios web y revisa cada incidente. Comprueba tus páginas cada pocos minutos y registra cada caída con su hora de inicio y de fin.",
      technologies: ["Next.js", "Vercel"],
      links: [{ label: "Visitar el sitio", href: "https://sitetimeline.vercel.app" }],
      visual: "sitetimeline",
      screenshots: [
        {
          src: "/assets/projects/sitetimeline-desktop.png",
          alt: "Página de inicio de SiteTimeline: «Know when your site stopped responding, and for how long.»",
          width: 2880,
          height: 1800,
          frame: "browser",
        },
        {
          src: "/assets/projects/sitetimeline-mobile.png",
          alt: "Página de inicio de SiteTimeline en un móvil",
          width: 780,
          height: 1688,
          frame: "phone",
        },
        {
          src: "/assets/projects/sitetimeline-login.png",
          alt: "Pantalla de inicio de sesión de SiteTimeline",
          width: 2880,
          height: 1800,
          frame: "browser",
        },
      ],
      features: [
        {
          title: "Disponibilidad por tiempo",
          text: "Se calcula con la duración real de los incidentes, no contando comprobaciones sueltas.",
        },
        {
          title: "Sin falsas alarmas",
          text: "Un sitio solo se marca como caído tras varios fallos consecutivos que tú configuras.",
        },
        {
          title: "Destinos seguros",
          text: "Las direcciones internas y privadas nunca se comprueban, ni siquiera tras una redirección.",
        },
      ],
      stripCaption: "Ejemplo: 60 comprobaciones. Las barras altas son fallos.",
    },
  ],
  upcoming: {
    id: "upcoming",
    name: "Próximamente",
    summary:
      "Aplicaciones y proyectos en camino. Este espacio se llena a medida que se publican.",
    items: [],
    openSlot: "Espacio libre",
    openSlotNote: "Aquí llega el próximo proyecto",
  },
  about: {
    title: "Sobre mí",
    statement:
      "Soy Amelia Nuñez, desarrolladora de software. Trabajo en web full-stack, móvil e IoT. Me gustan los proyectos donde el hardware, los datos y la interfaz tienen que funcionar juntos.",
    educationTitle: "Formación",
    education: [],
  },
  contact: {
    title: "Hablemos",
    lead: "¿Tienes un proyecto, una vacante o una pregunta? Escríbeme.",
    email: "ameliant310@gmail.com",
    emailLabel: "Correo",
    github: { label: "GitHub", href: "https://github.com/aanthill" },
  },
  footer: {
    privacy: "Privacidad",
    rights: "Todos los derechos reservados",
    top: "Volver arriba",
  },
  marquee: ["Full-Stack", "Móvil", "IoT", "Del hardware a la interfaz"],
};
