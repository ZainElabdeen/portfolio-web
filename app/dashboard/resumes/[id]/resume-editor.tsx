"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updateResume } from "@/actions/resume.action";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FileText,
  Save,
  ChevronLeft,
  Download,
} from "lucide-react";
import Link from "next/link";
import ResumePreview from "./resume-preview";

type Section = "personal" | "summary" | "experience" | "education" | "skills";

interface ResumeContent {
  personal?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  selectedExperiences?: string[];
  selectedEducations?: string[];
  selectedSkills?: string[];
}

interface ResumeEditorProps {
  resume: {
    id: string;
    title: string;
    layout: string;
    themeColor: string;
    content: any;
  };
  profile: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    summary?: string | null;
    experiences: Array<{
      id: string;
      title: string;
      companyName?: string | null;
      location?: string | null;
      description: string;
      startDate: Date;
      endDate?: Date | null;
      current: boolean;
    }>;
    educations: Array<{
      id: string;
      institution: string;
      degree: string;
      startDate: Date;
      endDate?: Date | null;
      current: boolean;
    }>;
    skills: Array<{
      id: string;
      title: string;
    }>;
  };
}

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "personal",
    label: "Personal Details",
    icon: <User className="h-4 w-4" />,
  },
  { id: "summary", label: "Summary", icon: <FileText className="h-4 w-4" /> },
  {
    id: "experience",
    label: "Experience",
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: "education",
    label: "Education",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  { id: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
];

export default function ResumeEditor({ resume, profile }: ResumeEditorProps) {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(resume.title);

  const initialContent: ResumeContent = resume.content || {};
  const [content, setContent] = useState<ResumeContent>({
    personal: {
      fullName: initialContent.personal?.fullName || profile.fullName,
      email: initialContent.personal?.email || profile.email,
      phone: initialContent.personal?.phone || profile.phone || "",
      location: initialContent.personal?.location || "",
      linkedin: initialContent.personal?.linkedin || "",
      website: initialContent.personal?.website || "",
    },
    summary: initialContent.summary || profile.summary || "",
    selectedExperiences:
      initialContent.selectedExperiences ||
      profile.experiences.map((e) => e.id),
    selectedEducations:
      initialContent.selectedEducations || profile.educations.map((e) => e.id),
    selectedSkills:
      initialContent.selectedSkills || profile.skills.map((s) => s.id),
  });

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateResume(resume.id, {
        title,
        content,
      });
      if (result.success) {
        toast.success("Resume saved successfully");
      } else {
        toast.error("Failed to save resume");
      }
    });
  };

  const updatePersonal = (field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const toggleExperience = (id: string) => {
    setContent((prev) => ({
      ...prev,
      selectedExperiences: prev.selectedExperiences?.includes(id)
        ? prev.selectedExperiences.filter((e) => e !== id)
        : [...(prev.selectedExperiences || []), id],
    }));
  };

  const toggleEducation = (id: string) => {
    setContent((prev) => ({
      ...prev,
      selectedEducations: prev.selectedEducations?.includes(id)
        ? prev.selectedEducations.filter((e) => e !== id)
        : [...(prev.selectedEducations || []), id],
    }));
  };

  const toggleSkill = (id: string) => {
    setContent((prev) => ({
      ...prev,
      selectedSkills: prev.selectedSkills?.includes(id)
        ? prev.selectedSkills.filter((s) => s !== id)
        : [...(prev.selectedSkills || []), id],
    }));
  };

  const selectedExperiences = profile.experiences.filter((e) =>
    content.selectedExperiences?.includes(e.id),
  );
  const selectedEducations = profile.educations.filter((e) =>
    content.selectedEducations?.includes(e.id),
  );
  const selectedSkills = profile.skills.filter((s) =>
    content.selectedSkills?.includes(s.id),
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Left Sidebar - Editor */}
      <div className="w-[400px] border-r flex flex-col bg-background">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/resumes">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 w-48 font-medium"
            />
          </div>
          <Button onClick={handleSave} disabled={isPending} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeSection === section.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeSection === "personal" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Personal Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={content.personal?.fullName || ""}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={content.personal?.email || ""}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    value={content.personal?.phone || ""}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={content.personal?.location || ""}
                    onChange={(e) => updatePersonal("location", e.target.value)}
                    placeholder="New York, USA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">LinkedIn</label>
                  <Input
                    value={content.personal?.linkedin || ""}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input
                    value={content.personal?.website || ""}
                    onChange={(e) => updatePersonal("website", e.target.value)}
                    placeholder="johndoe.com"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "summary" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Professional Summary</h3>
              <RichTextEditor
                value={content.summary || ""}
                onChange={(value) =>
                  setContent((prev) => ({ ...prev, summary: value }))
                }
                placeholder="Write a brief professional summary..."
              />
            </div>
          )}

          {activeSection === "experience" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Experience</h3>
              <p className="text-sm text-muted-foreground">
                Select which experiences to include in this resume.
              </p>
              {profile.experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No experiences added yet. Add them in your profile.
                </p>
              ) : (
                <div className="space-y-2">
                  {profile.experiences.map((exp) => (
                    <label
                      key={exp.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        content.selectedExperiences?.includes(exp.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={content.selectedExperiences?.includes(exp.id)}
                        onChange={() => toggleExperience(exp.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.companyName}
                          {exp.companyName && exp.location ? " · " : ""}
                          {exp.location}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "education" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Education</h3>
              <p className="text-sm text-muted-foreground">
                Select which education entries to include.
              </p>
              {profile.educations.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No education added yet. Add them in your profile.
                </p>
              ) : (
                <div className="space-y-2">
                  {profile.educations.map((edu) => (
                    <label
                      key={edu.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        content.selectedEducations?.includes(edu.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={content.selectedEducations?.includes(edu.id)}
                        onChange={() => toggleEducation(edu.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.institution}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "skills" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Skills</h3>
              <p className="text-sm text-muted-foreground">
                Select skills to include in this resume.
              </p>
              {profile.skills.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No skills added yet. Add them in your profile.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.id)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        content.selectedSkills?.includes(skill.id)
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {skill.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="flex-1 bg-muted/30 overflow-auto p-8">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <ResumePreview
            content={content}
            experiences={selectedExperiences}
            educations={selectedEducations}
            skills={selectedSkills}
            themeColor={resume.themeColor}
          />
        </div>
      </div>
    </div>
  );
}
