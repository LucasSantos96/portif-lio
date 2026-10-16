import type { Dictionary } from "./pt";

const en: Dictionary = {
  header: {
    home: "Lucas Santos, back to top",
    nav: {
      about: "About",
      services: "Services",
      skills: "Stack",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
    },
    langToggleLabel: "Switch language to Portuguese",
  },
  hero: {
    name: "Lucas Santos, full-stack developer",
    title: "Websites, systems and AI agents that work for your business.",
    subtitle:
      "I build custom software and automations with n8n, LangChain, LangGraph and Mastra to take repetitive work off your team.",
    ctaWhatsapp: "Message me on WhatsApp",
    whatsappMessage: "Hi, I found your portfolio",
    ctaResume: "Download resume",
    ctaResumeAria: "Download resume as PDF",
    videoLabel: "Lucas coding at night in an office with two monitors",
    pauseVideo: "Pause background video",
    playVideo: "Play background video",
  },
  about: {
    title: "About me",
    lead: "Before I write code, I think about outcomes: more customers, more efficiency, more revenue.",
    paragraphs: [
      "I'm a full-stack developer with a business mindset. Running my own business taught me that technology only makes sense when it solves a real problem.",
      "That's why I focus on building smart systems, automating processes and removing the manual work that holds growth back, using integrations and AI agents that turn everyday operations into efficient, scalable machines.",    ],
    photoAlt: "Portrait of Lucas Santos smiling, wearing a black t-shirt",
  },
  services: {
    title: "What I do",
    intro:
      "From company websites to AI automation and rolling out your management system.",
    automation: {
      title: "Automations and AI agents",
      description:
        "n8n workflows and agents that answer customers, process orders and connect your systems, written in Python and TypeScript.",
      imageAlt: "n8n workflow with an AI agent connected to memory and tools",
      groups: {
        orchestration: "Orchestration",
        agents: "AI agents",
        languages: "Languages",
      },
    },
    sites: {
      title: "Websites",
      description:
        "Company sites, landing pages and portfolios that are fast, responsive and built to convert.",
    },
    systems: {
      title: "Web systems",
      description:
        "Custom systems with an admin panel, authentication and integrations with the tools you already use.",
    },
    erp: {
      title: "Management system consulting and rollout",
      description:
        "I'm an implementation partner and IT consultant: I set up, integrate and train your team on the ERP and digital menu.",
      partners: "Official partner",
    },
  },
  skills: {
    title: "Stack",
    intro: "The tools I use every day, from the front end to AI agents.",
  },
  projects: {
    title: "Projects",
    intro: "Open a project to see photos, videos and the details of each delivery.",
    empty: "No projects published yet. Go to /upload to add or publish a project.",
    openGallery: "View gallery",
    photos: (count: number) => (count === 1 ? "1 photo" : `${count} photos`),
    videos: (count: number) => (count === 1 ? "1 video" : `${count} videos`),
  },
  tools: {
    title: "Tools",
    intro: "Open source tools I built to solve problems in my day-to-day development work.",
    opensInNewTab: "(opens in a new tab)",
  },
  blog: {
    title: "Blog",
    intro: "Articles on automation, AI agents and custom software for businesses.",
    metaTitle: "Blog on automation, AI and software for businesses",
    metaDescription:
      "Practical articles on process automation, AI agents and custom software for businesses, by Lucas Santos.",
    empty: "The first articles are coming soon.",
    latest: "Latest articles",
    allArticles: "See all articles",
    readArticle: "Read article",
    minutes: (count: number) => `${count} min read`,
    publishedOn: "Published on",
    updatedOn: "Updated on",
    backToBlog: "All articles",
    toc: "In this article",
    tags: "Topics",
    related: "Keep reading",
    cta: {
      title: "Want to apply this in your business?",
      text: "Tell me about your operation and I'll reply with next steps. No strings attached.",
      whatsapp: "Message me on WhatsApp",
      whatsappMessage: (title: string, url: string) =>
        `Hi Lucas! I read the article "${title}" (${url}) and I'd like to talk about applying it in my business.`,
      formTitle: "Or leave your details and I'll get back to you",
    },
  },
  gallery: {
    back: "All projects",
    openSite: "Open project",
    viewCode: "View code",
    technologies: "Technologies",
    videosTitle: "Videos",
    photosTitle: "Photos",
    playVideo: (title: string) => `Play video for ${title}`,
    videoTitle: (title: string, index: number) => `${title}, video ${index}`,
    openPhoto: (index: number) => `Enlarge photo ${index}`,
    photoAlt: (title: string, index: number) => `${title}, photo ${index}`,
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
    counter: (current: number, total: number) => `${current} of ${total}`,
    nextProject: "Next project",
  },
  contact: {
    title: "Let's talk",
    subtitle:
      "Tell me what's slowing your operation down and I'll get back to you with next steps.",
    channelsTitle: "Rather reach out directly?",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    form: {
      service: "Service you need",
      servicePlaceholder: "Choose a service",
      serviceOptions: [
        "Websites",
        "Web systems",
        "Automations and AI agents",
        "ERP consulting and rollout",
      ],
      name: "Name",
      email: "Email",
      phone: "Phone or WhatsApp",
      message: "Message (optional)",
      messagePlaceholder: "Tell me a bit about the project",
      submit: "Send message",
      sending: "Sending...",
      success: "Message sent. You'll get a confirmation by email.",
      error: "Your message couldn't be sent. Try again or reach me on WhatsApp.",
    },
  },
  footer: {
    role: "Full-stack developer",
    rights: "All rights reserved.",
    linkedinAria: "Visit LinkedIn profile",
    githubAria: "Visit GitHub profile",
    whatsappAria: "Contact via WhatsApp",
    emailAria: "Send email",
  },
};

export default en;
