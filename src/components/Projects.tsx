import ProjectsClient from "@/components/ProjectsClient";
import { getPortfolioProjects } from "@/lib/projects";

const Projects = async () => {
  const projects = (await getPortfolioProjects()).filter((project) => project.published);

  return <ProjectsClient projects={projects} />;
};

export default Projects;
