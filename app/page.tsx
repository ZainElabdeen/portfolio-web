import About from "@/components/about";
import Education from "@/components/education";
import Experience from "@/components/experience";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import ActiveSectionProvider from "@/providers/active-section-provider";
import { getProjects } from "@/actions/project.action";
import { getSkills } from "@/actions/skill.action";
import { getExperiences } from "@/actions/experience.action";
import { getEducations } from "@/actions/education.action";
import { getPublicProfile } from "@/actions/profile.action";

export default async function Home() {
  const [dbProjects, dbSkills, dbExperiences, dbEducations, profile] = await Promise.all([
    getProjects(),
    getSkills(),
    getExperiences(),
    getEducations(),
    getPublicProfile(),
  ]);

  const projects = dbProjects.length > 0 ? dbProjects : [];
  const skills = dbSkills.map((s) => s.title);

  return (
    <ActiveSectionProvider>
      <main className="flex flex-col items-center px-4 pt-28 sm:pt-36">
        <Header />
        <Intro profile={profile} />
        <SectionDivider />
        <About profile={profile} />
        <Projects projects={projects} />
        <Skills skills={skills} />
        <Experience experiences={dbExperiences} />
        <Education educations={dbEducations} />
        <Footer />
      </main>
    </ActiveSectionProvider>
  );
}
