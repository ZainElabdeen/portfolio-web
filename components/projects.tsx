"use client";

import { Fragment } from "react";

import SectionHeading from "./section-heading";
import ProjectItem from "./ProjectItem";
import { useSectionInView } from "@/hooks/use-sectionIn-view";
// import { projectsData } from "@/lib/data"; // Removed static import

type ProjectsProps = {
  projects: readonly Project[] | Project[];
};

type Project = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
};

const Projects = ({ projects = [] }: ProjectsProps) => {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section className="scroll-mt-28 mb-28" id="projects" ref={ref}>
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projects.map((project) => (
          <Fragment key={project.title}>
            <ProjectItem
              title={project.title}
              description={project.description}
              tags={project.tags}
              imageUrl={project.imageUrl}
            />
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default Projects;
