import About from "@/components/about";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import ActiveSectionProvider from "@/providers/active-section-provider";
import { getProjects } from "@/actions/project.action";
import { projectsData } from "@/lib/data"; // Fallback static data

export default async function Home() {
  const dbProjects = await getProjects();
  const projects = dbProjects.length > 0 ? dbProjects : projectsData;

  return (
    <ActiveSectionProvider>
      <main className="flex flex-col items-center px-4 pt-28 sm:pt-36">
        <Header />
        <Intro />
        <SectionDivider />
        <About />
        <Projects projects={projects} />
        <Skills />
        <Experience />
        <Footer />
      </main>
    </ActiveSectionProvider>
  );
}
