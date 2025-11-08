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
            "https://github.com/LucasSantos96/api_barber"
          }
          image={"/system-barber.png"}
          title="API Barber"
          subtitle="Sistema completo de gestão de clientes para barbearia desenvolvido com Next.js, Node.js e Prisma. Inclui cadastro, edição e exclusão de clientes, associação de planos com duração de 30 dias, contagem regressiva automática de dias restantes, renovação de planos com um clique e status dinâmico (ativo/inativo). Integração frontend/backend completa, suporte a MySQL (produção) e SQLite (local), e configuração com PM2 para execução contínua."
          
          tecImg={[
            <Image
              key={'barber1'}
              src={'/Next.js.png'}
              alt="Next.js"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'barber3'}
              src={'/typescript.png'}
              alt="TypeScript"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'barber4'}
              src={'/Tailwindcss.png'}
              alt="Tailwind CSS"
              width={36}
              height={36}
              className=""
            />,
            <Image
            key={'barber5'}
            src={'/prisma.png'}
            alt="Prisma ORM"
            width={36}
            height={36}
            className=""
          />,
            <Image
              key={'barber6'}
              src={'/Nodejs.png'}
              alt="Node.js"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'barber7'}
              src={'/mysql.png'}
              alt="MySQL"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'barber8'}
              src={'/Git.png'}
              alt="Git"
              width={36}
              height={36}
              className=""
            />
          ]}
        />

        <CardProjects
          link={
            "https://lp-stefani.vercel.app/"
          }
          image={"/stefani.png"} // Certifique-se de adicionar a imagem do projeto na pasta public
          title="Stefani Fotografia"
          subtitle="Landing page desenvolvida para uma fotógrafa profissional, com foco em apresentar seu trabalho de forma elegante e responsiva. Projeto construído com Next.js, TypeScript e Tailwind CSS, seguindo boas práticas de desenvolvimento e design moderno."
          
          tecImg={[
            <Image
              key={'stefani1'}
              src={'/Next.js.png'}
              alt="Next.js"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'stefani2'}
              src={'/Tailwindcss.png'}
              alt="Tailwind CSS"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'stefani3'}
              src={'/typescript.png'}
              alt="TypeScript"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'stefani4'}
              src={'/Git.png'}
              alt="Git"
              width={36}
              height={36}
              className=""
            />
          ]}
        />


                 <CardProjects
           link={
             "https://blognode-mntu.onrender.com/"
           }
           image={"/blognode.png"}
           title="BlogNode"
                     subtitle="Projeto BlogNode – Aplicação fullstack desenvolvida com Node.js, Express, MongoDB e Bootstrap. Inclui sistema completo de autenticação, CRUD de postagens com categorias, listagem de posts recentes e layout responsivo. Foco em boas práticas de desenvolvimento, estrutura modular e integração front-end/back-end."

          tecImg={[
            <Image
              key={'blog1'}
              src={'/Nodejs.png'}
              alt="Node.js"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'blog2'}
              src={'/MongoDB.png'}
              alt="MongoDB"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'blog3'}
              src={'/JavaScript.png'}
              alt="JavaScript"
              width={36}
              height={36}
              className=""
            />,
            <Image
              key={'blog4'}
              src={'/Git.png'}
              alt="Git"
              width={36}
              height={36}
              className=""
            />,
            <Image
            key={'blog5'}
            src={'/bootstrap.png'}
            alt="bootstrap"
            width={36}
            height={36}
            className=""
          />
          ]}
        />

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
          height={36}
          className=""
        />,
         <Image
             key={'2'}
          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={'3'}
          src={'/JavaScript.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={'4'}
          src={'/Git.png'}
          alt="project"
          width={36}
          height={36}
          className=""
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
          height={36}
          className=""
        />,
         <Image
             key={2}

          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={3}

          src={'/JavaScript.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={4}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={36}
          className=""
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
          height={36}
          className=""
        /> ,
         <Image
             key={6}

          src={'/Tailwindcss.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        /> ,
         <Image
             key={8}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={9}

          src={'/typescript.png'}
          alt="project"
          width={36}
          height={36}
          className=""
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
          height={36}
          className=""
        />,
         <Image
             key={11}

          src={'/CSS3.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={12}

          src={'/JavaScript.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={13}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={36}
          className=""
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
          height={36}
          className=""
        />,
         <Image
             key={15}

          src={'/CSS3.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={16}

          src={'/JavaScript.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />,
         <Image
             key={17}

          src={'/Git.png'}
          alt="project"
          width={36}
          height={36}
          className=""
        />
          ]}
        />
      </div>

    </section>
  );
};

export default Porjects;
