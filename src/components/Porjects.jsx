import CardProjects from "./CardProjects";

const Porjects = () => {
  return (
    <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center  lg:mx-32  lg:py-28" id="projetos">
      
      <div>
        <h2 className="text-[20px] mb-5 lg:text-[40px] lg:text-center">Projetos</h2>
      </div>

      <div className="w-full flex items-center justify-center  gap-4 flex-wrap  lg:flex-nowrap " >
        <CardProjects
          link={
            "https://sunglassesproject-git-main-lucassantos96s-projects.vercel.app"
          }
          image={"/projetoOculos.png"}
          title="Um sol pra cada um"
          subtitle="Projeto criado com NextJs usando um protótipo criado no figma afim de testar conhecimentos e boas praticas de design."
        />

            <CardProjects
          link={
            "https://ticket-generator-kwl1-git-main-lucassantos96s-projects.vercel.app"
          }
          image={"/projectTicket.png"}
          title="Ticket Generator"
          subtitle="Projeto criado com NextJs direto do site FrontEndMentor onde aceitei o desafio"
        />

           <CardProjects
          link={
            "https://lucassantos96.github.io/boa-forma/"
          }
          image={"/boaForma.png"}
          title="Boa forma"
          subtitle="Projeto criado com Html, Css e JavaScript, um site que além de um imc contém dicas de saúde etc.. "
        />
           <CardProjects
          link={
            "https://lucassantos96.github.io/linksseubeca/"
          }
          image={"/seuBeca.png"}
          title="Links Seu Beca"
          subtitle="Trabalho feito para uma barbearia com a idéia de deixar todos os links úteis em um só lugar. "
        />
      </div>

    </section>
  );
};

export default Porjects;
