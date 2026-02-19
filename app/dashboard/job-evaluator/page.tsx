import { getUserProfile } from "@/actions/profile.action";
import { getExperiences } from "@/actions/experience.action";
import { getEducations } from "@/actions/education.action";
import { getSkills } from "@/actions/skill.action";
import { getProjects } from "@/actions/project.action";
import { redirect } from "next/navigation";
import JobEvaluatorClient from "./job-evaluator-client";

export default async function JobEvaluatorPage() {
  const [profile, experiences, educations, skills, projects] = await Promise.all([
    getUserProfile(),
    getExperiences(),
    getEducations(),
    getSkills(),
    getProjects(),
  ]);

  if (!profile) {
    redirect("/dashboard/profile");
  }

  // Combine profile with related data
  const profileData = {
    ...profile,
    experiences,
    educations,
    skills,
    projects,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Job Evaluator</h1>
        <p className="text-muted-foreground">
          Paste a job description to evaluate your fit and generate a tailored
          resume.
        </p>
      </div>

      <JobEvaluatorClient profile={profileData} />
    </div>
  );
}
