import { getResumeById } from "@/actions/resume.action";
import { getUserProfile } from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ResumeEditor from "./resume-editor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumeEditPage({ params }: PageProps) {
  const { id } = await params;
  const [resume, profile] = await Promise.all([
    getResumeById(id),
    getUserProfile(),
  ]);

  if (!resume || !profile) {
    notFound();
  }

  return (
    <ResumeEditor
      resume={resume}
      profile={profile}
    />
  );
}
