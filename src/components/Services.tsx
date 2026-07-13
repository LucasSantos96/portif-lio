import React from "react";
import Image from "next/image";

interface ServiceCardData {
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

const photoServices: ServiceCardData[] = [
  {
    title: "Sites",
    description:
      "Sites institucionais, landing pages e portfólios rápidos, responsivos e otimizados.",
    icon: "🌐",
    imageUrl:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Sistemas Web",
    description:
      "Sistemas sob medida para o seu negócio, com painel administrativo e integrações.",
    icon: "🖥️",
    imageUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Automações com n8n",
    description:
      "Fluxos automatizados que conectam suas ferramentas e eliminam tarefas manuais.",
    icon: "🔗",
    imageUrl: "/services/n8n-flow.png",
  },
];

const partnerLogos = [
  { name: "Bling", src: "/services/bling.webp" },
  { name: "Olist", src: "/services/olist.webp" },
  { name: "CardápioWeb", src: "/services/cardapioweb.webp" },
];

const Services: React.FC = () => {
  return (
    <section
      className="mt-20 mx-4 text-white mb-14 lg:mx-32 lg:py-20"
      id="servicos"
    >
      <div className="text-center mb-12">
        <h2 className="text-[20px] mb-5 lg:text-[40px]">Serviços</h2>
        <p className="text-[#b0afaf] text-sm lg:text-base max-w-2xl mx-auto">
          Do site institucional à automação de processos e implementação de
          sistemas de gestão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {photoServices.map((service) => (
          <div
            key={service.title}
            className="relative rounded-2xl overflow-hidden min-h-[220px] flex items-end"
          >
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121417]/95 via-[#121417]/55 to-[#121417]/15" />
            <div className="absolute top-4 left-4 bg-[#0980ecdd] size-10 rounded-full flex items-center justify-center text-lg">
              {service.icon}
            </div>
            <div className="relative z-10 p-6">
              <h3 className="text-lg font-semibold mb-1.5">
                {service.title}
              </h3>
              <p className="text-sm text-[#e6e6e6] max-w-[90%]">
                {service.description}
              </p>
            </div>
          </div>
        ))}

        <div className="bg-[#ffffff1a] hover:bg-[#ffffff2a] transition-colors duration-300 rounded-2xl p-6 min-h-[220px] flex flex-col justify-center">
          <div className="bg-[#0980ec] size-[52px] rounded-full flex items-center justify-center text-xl mb-4">
            🤝
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Consultoria & Implementação de Sistemas de Gestão
          </h3>
          <p className="text-sm text-[#b0afaf] mb-4">
            Parceiro implementador e consultor de TI para sistemas de gestão e
            cardápio digital.
          </p>
          <div className="flex gap-3 flex-wrap">
            {partnerLogos.map((logo) => (
              <div
                key={logo.name}
                className="bg-[#ffffff1a] rounded-lg px-3 py-2 flex items-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={80}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
