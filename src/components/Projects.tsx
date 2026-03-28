import { ProjectCard } from "@/components/ui/project-card";
import { getPortfolioProjects } from "@/lib/projects";

const Projects = async () => {
  const projects = (await getPortfolioProjects()).filter((project) => project.published);

  return (
    <section
      className="my-20 mx-4 mb-14 flex flex-col items-center text-white lg:mx-32 lg:py-28"
      id="projetos"
    >
      <div>
        <h2 className="mb-5 text-[20px] lg:text-center lg:text-[40px]">Projetos</h2>
      </div>

      {projects.length ? (
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              imgSrc={project.imageUrl}
              title={project.title}
              description={project.description}
              link={project.projectUrl}
              technologies={project.technologies}
              className="bg-[#ffffff0d] text-white ring-white/10"
            />
          ))}
        </div>
      ) : (
        <p className="text-zinc-300">
          Nenhum projeto publicado ainda. Acesse <code>/upload</code> para adicionar ou publicar um projeto.
        </p>
      )}
    </section>
  );
};

export default Projects;
