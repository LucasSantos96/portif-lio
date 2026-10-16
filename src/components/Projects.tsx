import ProjectsClient from "@/components/ProjectsClient";
import ToolsClient from "@/components/ToolsClient";
import { getPortfolioProjects } from "@/lib/projects";

const Projects = async () => {
  const items = (await getPortfolioProjects()).filter((item) => item.published);

  return (
    <>
      <ProjectsClient projects={items.filter((item) => item.category === "project")} />
      <ToolsClient tools={items.filter((item) => item.category === "tool")} />
    </>
  );
};

export default Projects;
