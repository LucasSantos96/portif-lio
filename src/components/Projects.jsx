import CardProjects from "./CardProjects";
import Image from "next/image";

const Porjects = () => {
  return (
    <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center  lg:mx-32  lg:py-28" id="projetos">
      
      <div>
        <h2 className="text-[20px] mb-5 lg:text-[40px] lg:text-center">Projetos</h2>
      </div>

      <div className="w-full flex items-center justify-center  gap-10 flex-wrap   " >

         <CardProjects
          link={
            "https://lpyoga.vercel.app/"
          }
          image={"/shanty.png"}
          title="Shanty"
          subtitle="Projeto desenvolvido com Next.js, baseado em um protótipo criado no Figma, com o objetivo de praticar e aplicar boas práticas de design e desenvolvimento front-end. O site simula a página de um estúdio de Yoga e Meditação, explorando conceitos de layout responsivo, tipografia, hierarquia visual e componentização no React. Além do aspecto estético, o projeto serviu como exercício para aprimorar organização de código, estrutura de pastas e padronização de estilos, visando uma experiência fluida e consistente em diferentes dispositivos."




             tecImg={[
             <Image
             key={'1'}
          src={'/Next.js.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={'2'}
          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={'3'}
          src={'/Javascript.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={'4'}
          src={'/Git.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />
          ]}
        />

        <CardProjects
          link={
            "https://sunglassesproject-git-main-lucassantos96s-projects.vercel.app"
          }
          image={"/projetoOculos.png"}
          title="Um sol pra cada um"
          subtitle="Projeto criado com NextJs usando um protótipo criado no figma afim de testar conhecimentos e boas praticas de design."

              tecImg={[
             <Image
             key={1}
          src={'/Next.js.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={2}

          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={3}

          src={'/Javascript.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={4}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />
          ]}
        />


            <CardProjects
          link={
            "https://ticket-generator-kwl1-git-main-lucassantos96s-projects.vercel.appn"
          }
          image={"/projectTicket.png"}
          title="Ticket Generator"
          subtitle="Projeto criado com NextJs direto do site FrontEndMentor onde aceitei o desafio"

          tecImg={[
            <Image
             key={5}

          src={'/Next.js.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        /> ,
         <Image
             key={6}

          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        /> ,
         <Image
             key={8}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={9}

          src={'/typescript.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />

          ]}
        />


           <CardProjects
          link={
            "https://lucassantos96.github.io/boa-forma/"
          }
          image={"/boaForma.png"}
          title="Boa forma"
          subtitle="Projeto criado com Html, Css e JavaScript, um site que além de um imc contém dicas de saúde etc.. "

          tecImg={[
             <Image
             key={10}

          src={'/Html5.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={11}

          src={'/CSS3.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={12}

          src={'/Javascript.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={13}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />
          ]}
        />

           <CardProjects
          link={
            "https://lucassantos96.github.io/linksseubeca/"
          }
          image={"/seuBeca.png"}
          title="Links Seu Beca"
          subtitle="Trabalho feito para uma barbearia com a idéia de deixar todos os links úteis em um só lugar. "

              tecImg={[
             <Image
             key={14}

          src={'/Html5.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={15}

          src={'/CSS3.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={16}

          src={'/Javascript.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />,
         <Image
             key={17}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={100}
          className="rounded-full mb-4 hover:opacity-40 hover:shadow-[0_4px_24px_0_rgba(245,125,56,0.3)] transition duration-300"
        />
          ]}
        />
      </div>

    </section>
  );
};

export default Porjects;
