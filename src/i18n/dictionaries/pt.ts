const pt = {
  header: {
    home: "Lucas Santos, voltar ao início",
    nav: {
      about: "Sobre",
      services: "Serviços",
      skills: "Stack",
      projects: "Projetos",
      contact: "Contato",
    },
    langToggleLabel: "Mudar idioma para inglês",
  },
  hero: {
    name: "Lucas Santos, desenvolvedor full-stack",
    title: "Sites, sistemas e agentes de IA que trabalham pelo seu negócio.",
    subtitle:
      "Construo software sob medida e automações com n8n, LangChain, LangGraph e Mastra para tirar o trabalho repetitivo da sua equipe.",
    ctaWhatsapp: "Conversar no WhatsApp",
    whatsappMessage: "Olá, vim do seu portfólio",
    ctaResume: "Baixar currículo",
    ctaResumeAria: "Baixar currículo em PDF",
    videoLabel: "Lucas programando à noite em um escritório com dois monitores",
    pauseVideo: "Pausar vídeo de fundo",
    playVideo: "Reproduzir vídeo de fundo",
  },
  about: {
    title: "Sobre mim",
    lead: "Antes de pensar em código, penso em resultado: mais clientes, mais eficiência, mais faturamento.",
    paragraphs: [
      "Sou desenvolvedor full-stack com visão de negócio. Minha experiência empreendendo me ensinou que tecnologia só faz sentido quando resolve um problema de verdade.",
      "Por isso meu foco é criar sistemas inteligentes, automatizar processos e eliminar as tarefas manuais que travam o crescimento, com integrações e agentes de IA que transformam operações comuns em máquinas eficientes e escaláveis.",    ],
    photoAlt: "Retrato de Lucas Santos sorrindo, de camiseta preta",
  },
  services: {
    title: "O que eu faço",
    intro:
      "Do site institucional à automação com IA e à implantação do seu sistema de gestão.",
    automation: {
      title: "Automações e agentes de IA",
      description:
        "Fluxos no n8n e agentes que atendem clientes, processam pedidos e conectam seus sistemas, escritos em Python e TypeScript.",
      imageAlt: "Fluxo no n8n com um agente de IA ligado a memória e ferramentas",
      groups: {
        orchestration: "Orquestração",
        agents: "Agentes de IA",
        languages: "Linguagens",
      },
    },
    sites: {
      title: "Sites",
      description:
        "Sites institucionais, landing pages e portfólios rápidos, responsivos e prontos para converter.",
    },
    systems: {
      title: "Sistemas web",
      description:
        "Sistemas sob medida com painel administrativo, autenticação e integrações com o que você já usa.",
    },
    erp: {
      title: "Consultoria e implantação de sistemas de gestão",
      description:
        "Sou parceiro implementador e consultor de TI: configuro, integro e treino sua equipe no ERP e no cardápio digital.",
      partners: "Parceiro oficial",
    },
  },
  skills: {
    title: "Stack",
    intro: "As ferramentas que uso no dia a dia, do front-end aos agentes de IA.",
  },
  projects: {
    title: "Projetos",
    intro: "Clique em um projeto para ver fotos, vídeos e os detalhes de cada entrega.",
    empty:
      "Nenhum projeto publicado ainda. Acesse /upload para adicionar ou publicar um projeto.",
    openGallery: "Ver galeria",
    photos: (count: number) => (count === 1 ? "1 foto" : `${count} fotos`),
    videos: (count: number) => (count === 1 ? "1 vídeo" : `${count} vídeos`),
  },
  tools: {
    title: "Ferramentas",
    intro: "Ferramentas open source que criei para resolver problemas do meu dia a dia de desenvolvimento.",
    opensInNewTab: "(abre em nova aba)",
  },
  gallery: {
    back: "Todos os projetos",
    openSite: "Abrir projeto",
    viewCode: "Ver código",
    technologies: "Tecnologias",
    videosTitle: "Vídeos",
    photosTitle: "Fotos",
    playVideo: (title: string) => `Reproduzir vídeo de ${title}`,
    videoTitle: (title: string, index: number) => `${title}, vídeo ${index}`,
    openPhoto: (index: number) => `Ampliar foto ${index}`,
    photoAlt: (title: string, index: number) => `${title}, foto ${index}`,
    close: "Fechar",
    previous: "Foto anterior",
    next: "Próxima foto",
    counter: (current: number, total: number) => `${current} de ${total}`,
    nextProject: "Próximo projeto",
  },
  contact: {
    title: "Vamos conversar",
    subtitle:
      "Conte o que está travando sua operação e eu respondo com os próximos passos.",
    channelsTitle: "Prefere falar direto?",
    emailLabel: "E-mail",
    whatsappLabel: "WhatsApp",
    linkedinLabel: "LinkedIn",
    githubLabel: "GitHub",
    form: {
      service: "Serviço de interesse",
      servicePlaceholder: "Selecione um serviço",
      serviceOptions: [
        "Sites",
        "Sistemas web",
        "Automações e agentes de IA",
        "Consultoria e implantação de ERP",
      ],
      name: "Nome",
      email: "E-mail",
      phone: "Telefone ou WhatsApp",
      message: "Mensagem (opcional)",
      messagePlaceholder: "Conte um pouco sobre o projeto",
      submit: "Enviar mensagem",
      sending: "Enviando...",
      success: "Mensagem enviada. Você vai receber uma confirmação por e-mail.",
      error: "Não foi possível enviar sua mensagem. Tente de novo ou chame no WhatsApp.",
    },
  },
  footer: {
    role: "Desenvolvedor full-stack",
    rights: "Todos os direitos reservados.",
    linkedinAria: "Visitar perfil no LinkedIn",
    githubAria: "Visitar perfil no GitHub",
    whatsappAria: "Entrar em contato via WhatsApp",
    emailAria: "Enviar e-mail",
  },
};

export type Dictionary = typeof pt;

export default pt;
