"use client";

import { Fragment } from "react";

import { projectsData } from "@/lib/data";
import SectionHeading from "./section-heading";
import ProjectItem from "./ProjectItem";
import { useSectionInView } from "@/hooks/use-sectionIn-view";

const Projects = () => {
  const { ref } = useSectionInView("Projects", 0.5);

  return (
    <section className="scroll-mt-28" id="projects" ref={ref}>
      <SectionHeading>My projects</SectionHeading>
      <div>
        {projectsData.map((project) => (
          <Fragment key={project.title}>
            <ProjectItem {...project} />
          </Fragment>
        ))}
      </div>
    </section>
  );
};

export default Projects;
