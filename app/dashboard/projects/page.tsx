import prisma from "@/prisma/client";
import ProjectTable from "./project-table";

const ProjectsPage = async () => {
  const projects = await prisma.project.findMany({ orderBy: { id: "desc" } });

  return <ProjectTable projects={projects} />;
};

export default ProjectsPage;
