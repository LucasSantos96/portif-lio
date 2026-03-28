import React from "react";
import Image from "next/image";

const About: React.FC = () => {
  return (
    <section
      className="mt-20 text-white mx-5 lg:mx-32 lg:flex lg:justify-between lg:py-20 lg:items-center"
      id="sobre"
    >
      <div className="lg:w-[660px] ">
        <h2 className="text-[20px] mb-2 lg:text-[40px]">Sobre mim</h2>
        <p className="font-light text-sm text-[#b0afaf] lg:text-[18px]">
          Sou desenvolvedor full stack com visão de negócio. Antes de pensar em
          código, penso em resultado: mais clientes, mais eficiência e mais
          faturamento. Cada projeto que entrego tem um objetivo claro — gerar
          valor real. Minha experiência com empreendedorismo me ensinou uma
          coisa: tecnologia só faz sentido quando resolve problemas de verdade.
          Por isso, meu foco está em criar sistemas inteligentes, automatizar
          processos e eliminar tarefas manuais que travam o crescimento.
          Trabalho com tecnologias modernas e integrações avançadas (como
          automações e fluxos inteligentes) para transformar operações comuns em
          máquinas eficientes e escaláveis.
        </p>
      </div>
      <div className="flex justify-center mt-5">
        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={328}
          height={100}
          className="flex lg:hidden"
        />

        <Image
          src={"/sobre.png"}
          alt="sobre"
          width={402}
          height={100}
          className="hidden lg:flex"
        />
      </div>
    </section>
  );
};

export default About;
