import { Fragment } from "react";

import { projectsData } from "@/app/lib/data";
import SectionHeading from "./section-heading";
import ProjectItem from "./ProjectItem";

const Projects = () => {
  return (
    <section className="scroll-mt-28 mb-28">
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
