import { getResumeById } from "@/actions/resume.action";
import { getUserProfile } from "@/actions/profile.action";
import { getExperiences } from "@/actions/experience.action";
import { getEducations } from "@/actions/education.action";
import { getSkills } from "@/actions/skill.action";
import { notFound } from "next/navigation";
import ResumeEditor from "./resume-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeEditPage({ params }: PageProps) {
  const { id } = await params;
  const [resume, profile, experiences, educations, skills] = await Promise.all([
    getResumeById(id),
    getUserProfile(),
    getExperiences(),
    getEducations(),
    getSkills(),
  ]);

  if (!resume || !profile) {
    notFound();
  }

  // Combine profile with related data for the editor
  const profileData = {
    ...profile,
    experiences,
    educations,
    skills,
  };

  return <ResumeEditor resume={resume} profile={profileData} />;
}
