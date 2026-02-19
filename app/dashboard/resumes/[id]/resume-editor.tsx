"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextViewer } from "@/components/ui/rich-text-viewer";
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
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import ResumePreview from "./resume-preview";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "personal" | "summary" | "experience" | "education" | "skills" | "ai";

/** Personal info overrides stored in resume.content */
interface PersonalOverride {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

interface AIEvaluation {
  evaluation: {
    matchPercentage: number;
    overallAssessment: string;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  };
  suggestedResume: {
    resumeTitle: string;
    summary: string;
    selectedExperienceIds: string[];
    selectedEducationIds: string[];
    selectedSkillIds: string[];
  };
  suggestedNewSkills: string[];
}

/** Summary override stored in resume.content */
interface ResumeContent {
  personal?: PersonalOverride;
  summary?: string;
  aiEvaluation?: AIEvaluation;
}

/** Custom (resume-only) experience not saved to the DB */
interface CustomExperience {
  id: string;
  title: string;
  companyName: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

/** Custom (resume-only) education not saved to the DB */
interface CustomEducation {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

/** Custom (resume-only) skill not saved to the DB */
interface CustomSkill {
  id: string;
  title: string;
}

interface DBExperience {
  id: string;
  title: string;
  companyName?: string | null;
  location?: string | null;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
}

interface DBEducation {
  id: string;
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
}

interface DBSkill {
  id: string;
  title: string;
}

interface ResumeEditorProps {
  resume: {
    id: string;
    title: string;
    layout: string;
    themeColor: string;
    // ID arrays from new schema
    experienceIds: string[];
    educationIds: string[];
    skillIds: string[];
    // Optional JSON content for personal overrides (Prisma returns JsonValue)
    content: unknown;
  };
  profile: {
    fullName: string;
    title?: string | null;
    email: string;
    phone?: string | null;
    location?: string | null;
    summary?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    experiences: DBExperience[];
    educations: DBEducation[];
    skills: DBSkill[];
  };
}

// ─── Section nav config ───────────────────────────────────────────────────────

const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "personal",   label: "Personal",   icon: <User className="h-4 w-4" /> },
  { id: "summary",    label: "Summary",    icon: <FileText className="h-4 w-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { id: "education",  label: "Education",  icon: <GraduationCap className="h-4 w-4" /> },
  { id: "skills",     label: "Skills",     icon: <Wrench className="h-4 w-4" /> },
  { id: "ai",         label: "AI",         icon: <Sparkles className="h-4 w-4" /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ResumeEditor({ resume, profile }: ResumeEditorProps) {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(resume.title);

  // ── Selected DB IDs ──────────────────────────────────────────────────────
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>(
    resume.experienceIds ?? [],
  );
  const [selectedEduIds, setSelectedEduIds] = useState<string[]>(
    resume.educationIds ?? [],
  );
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(
    resume.skillIds ?? [],
  );

  // ── Custom resume-only items ─────────────────────────────────────────────
  type SavedContent = ResumeContent & {
    customExperiences?: CustomExperience[];
    customEducations?: CustomEducation[];
    customSkills?: CustomSkill[];
  };
  const savedContent: SavedContent =
    (resume.content as SavedContent) ?? {};

  const [personal, setPersonal] = useState<PersonalOverride>({
    fullName:  savedContent.personal?.fullName  ?? profile.fullName,
    title:     savedContent.personal?.title     ?? profile.title    ?? "",
    email:     savedContent.personal?.email     ?? profile.email,
    phone:     savedContent.personal?.phone     ?? profile.phone    ?? "",
    location:  savedContent.personal?.location  ?? profile.location ?? "",
    linkedin:  savedContent.personal?.linkedin  ?? profile.linkedinUrl ?? "",
    website:   savedContent.personal?.website   ?? profile.websiteUrl  ?? "",
  });

  const [summary, setSummary] = useState<string>(
    savedContent.summary ?? profile.summary ?? "",
  );

  const [customExperiences, setCustomExperiences] = useState<CustomExperience[]>(
    savedContent.customExperiences ?? [],
  );
  const [customEducations, setCustomEducations] = useState<CustomEducation[]>(
    savedContent.customEducations ?? [],
  );
  const [customSkills, setCustomSkills] = useState<CustomSkill[]>(
    savedContent.customSkills ?? [],
  );

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    startTransition(async () => {
      const result = await updateResume(resume.id, {
        title,
        experienceIds: selectedExpIds,
        educationIds:  selectedEduIds,
        skillIds:      selectedSkillIds,
        content: {
          personal,
          summary,
          customExperiences,
          customEducations,
          customSkills,
        },
      });
      if (result.success) {
        toast.success("Resume saved");
      } else {
        toast.error("Failed to save resume");
      }
    });
  };

  const handleDownloadPDF = () => window.print();

  // ── Toggle DB items ───────────────────────────────────────────────────────
  const toggleExp = (id: string) =>
    setSelectedExpIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleEdu = (id: string) =>
    setSelectedEduIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleSkill = (id: string) =>
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // ── Custom experience helpers ─────────────────────────────────────────────
  const addCustomExp = () => {
    const item: CustomExperience = {
      id: `cexp-${Date.now()}`,
      title: "", companyName: "", location: "",
      description: "", startDate: "", endDate: "", current: false,
    };
    setCustomExperiences((prev) => [...prev, item]);
    setEditingExpId(item.id);
  };

  const updateCustomExp = (id: string, field: keyof CustomExperience, value: string | boolean) =>
    setCustomExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const deleteCustomExp = (id: string) => {
    setCustomExperiences((prev) => prev.filter((e) => e.id !== id));
    if (editingExpId === id) setEditingExpId(null);
  };

  // ── Custom education helpers ──────────────────────────────────────────────
  const addCustomEdu = () => {
    const item: CustomEducation = {
      id: `cedu-${Date.now()}`,
      institution: "", degree: "",
      startDate: "", endDate: "", current: false,
    };
    setCustomEducations((prev) => [...prev, item]);
    setEditingEduId(item.id);
  };

  const updateCustomEdu = (id: string, field: keyof CustomEducation, value: string | boolean) =>
    setCustomEducations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );

  const deleteCustomEdu = (id: string) => {
    setCustomEducations((prev) => prev.filter((e) => e.id !== id));
    if (editingEduId === id) setEditingEduId(null);
  };

  // ── Custom skill helpers ──────────────────────────────────────────────────
  const addCustomSkill = () => {
    const item: CustomSkill = { id: `csk-${Date.now()}`, title: "" };
    setCustomSkills((prev) => [...prev, item]);
  };

  const updateCustomSkill = (id: string, value: string) =>
    setCustomSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: value } : s)),
    );

  const deleteCustomSkill = (id: string) =>
    setCustomSkills((prev) => prev.filter((s) => s.id !== id));

  // ── Build preview data ────────────────────────────────────────────────────
  const previewExperiences = [
    ...profile.experiences.filter((e) => selectedExpIds.includes(e.id)),
    ...customExperiences.map((e) => ({
      ...e,
      startDate: e.startDate ? new Date(e.startDate) : new Date(),
      endDate:   e.endDate   ? new Date(e.endDate)   : null,
    })),
  ];

  const previewEducations = [
    ...profile.educations.filter((e) => selectedEduIds.includes(e.id)),
    ...customEducations.map((e) => ({
      ...e,
      startDate: e.startDate ? new Date(e.startDate) : new Date(),
      endDate:   e.endDate   ? new Date(e.endDate)   : null,
    })),
  ];

  const previewSkills = [
    ...profile.skills.filter((s) => selectedSkillIds.includes(s.id)),
    ...customSkills,
  ];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden print:h-auto print:overflow-visible">

      {/* ── Left Sidebar ─────────────────────────────────────────────── */}
      <div className="w-[420px] border-r flex flex-col bg-background print:hidden">

        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/dashboard/resumes">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 font-medium"
            />
          </div>
          <Button onClick={handleSave} disabled={isPending} size="sm" className="shrink-0">
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>

        {/* Section tabs */}
        <div className="flex border-b overflow-x-auto shrink-0">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs whitespace-nowrap border-b-2 transition-colors ${
                activeSection === s.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* ── Personal ──────────────────────────────────────────────── */}
          {activeSection === "personal" && (
            <div className="space-y-3">
              <h3 className="font-semibold">Personal Details</h3>
              {(
                [
                  { label: "Full Name",         field: "fullName",  placeholder: "John Doe" },
                  { label: "Professional Title", field: "title",     placeholder: "Full Stack Engineer" },
                  { label: "Email",              field: "email",     placeholder: "john@example.com" },
                  { label: "Phone",              field: "phone",     placeholder: "+1 234 567 890" },
                  { label: "Location",           field: "location",  placeholder: "Dubai, UAE" },
                  { label: "LinkedIn",           field: "linkedin",  placeholder: "linkedin.com/in/…" },
                  { label: "Website",            field: "website",   placeholder: "yoursite.com" },
                ] as { label: string; field: keyof PersonalOverride; placeholder: string }[]
              ).map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-sm font-medium">{label}</label>
                  <Input
                    value={personal[field] ?? ""}
                    onChange={(e) =>
                      setPersonal((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          )}

          {/* ── Summary ───────────────────────────────────────────────── */}
          {activeSection === "summary" && (
            <div className="space-y-3">
              <h3 className="font-semibold">Professional Summary</h3>
              <RichTextEditor
                value={summary}
                onChange={setSummary}
                placeholder="Write a brief professional summary…"
              />
            </div>
          )}

          {/* ── Experience ────────────────────────────────────────────── */}
          {activeSection === "experience" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Experience</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addCustomExp}>
                    <Plus className="h-4 w-4 mr-1" /> Custom
                  </Button>
                  <Link href="/dashboard/experience" target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> Manage
                    </Button>
                  </Link>
                </div>
              </div>

              {/* DB experiences */}
              {profile.experiences.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    From Profile ({profile.experiences.length})
                  </p>
                  {profile.experiences.map((exp) => {
                    const selected = selectedExpIds.includes(exp.id);
                    return (
                      <div
                        key={exp.id}
                        className={`rounded-lg border transition-colors ${
                          selected ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <label className="flex items-start gap-3 p-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleExp(exp.id)}
                            className="mt-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{exp.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {exp.companyName}
                              {exp.location ? ` · ${exp.location}` : ""}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(exp.startDate), "MMM yyyy")} –{" "}
                              {exp.current
                                ? "Present"
                                : exp.endDate
                                ? format(new Date(exp.endDate), "MMM yyyy")
                                : "N/A"}
                            </p>
                          </div>
                        </label>
                        {selected && (
                          <div className="px-3 pb-3 pl-10">
                            <div className="text-xs border rounded p-2 bg-muted/30">
                              <RichTextViewer content={exp.description} />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Custom experiences */}
              {customExperiences.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Resume-only
                  </p>
                  {customExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
                    >
                      {editingExpId === exp.id ? (
                        <div className="space-y-2">
                          <Input value={exp.title} onChange={(e) => updateCustomExp(exp.id, "title", e.target.value)} placeholder="Job Title" className="h-8 text-sm" />
                          <Input value={exp.companyName} onChange={(e) => updateCustomExp(exp.id, "companyName", e.target.value)} placeholder="Company" className="h-8 text-sm" />
                          <Input value={exp.location} onChange={(e) => updateCustomExp(exp.id, "location", e.target.value)} placeholder="Location" className="h-8 text-sm" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input type="date" value={exp.startDate} onChange={(e) => updateCustomExp(exp.id, "startDate", e.target.value)} className="h-8 text-sm" />
                            <Input type="date" value={exp.endDate} onChange={(e) => updateCustomExp(exp.id, "endDate", e.target.value)} disabled={exp.current} className="h-8 text-sm" />
                          </div>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={exp.current} onChange={(e) => updateCustomExp(exp.id, "current", e.target.checked)} />
                            Currently working here
                          </label>
                          <RichTextEditor value={exp.description} onChange={(v) => updateCustomExp(exp.id, "description", v)} placeholder="Responsibilities…" />
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => setEditingExpId(null)}>Done</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteCustomExp(exp.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{exp.title || "Untitled"}</p>
                            <p className="text-xs text-muted-foreground">{exp.companyName || "No company"}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => setEditingExpId(exp.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {profile.experiences.length === 0 && customExperiences.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No experiences yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── Education ─────────────────────────────────────────────── */}
          {activeSection === "education" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Education</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addCustomEdu}>
                    <Plus className="h-4 w-4 mr-1" /> Custom
                  </Button>
                  <Link href="/dashboard/education" target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> Manage
                    </Button>
                  </Link>
                </div>
              </div>

              {/* DB educations */}
              {profile.educations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    From Profile ({profile.educations.length})
                  </p>
                  {profile.educations.map((edu) => {
                    const selected = selectedEduIds.includes(edu.id);
                    return (
                      <label
                        key={edu.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selected ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleEdu(edu.id)}
                          className="mt-1 shrink-0"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{edu.degree}</p>
                          <p className="text-xs text-muted-foreground">{edu.institution}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(edu.startDate), "MMM yyyy")} –{" "}
                            {edu.current
                              ? "Present"
                              : edu.endDate
                              ? format(new Date(edu.endDate), "MMM yyyy")
                              : "N/A"}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Custom educations */}
              {customEducations.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Resume-only
                  </p>
                  {customEducations.map((edu) => (
                    <div
                      key={edu.id}
                      className="p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
                    >
                      {editingEduId === edu.id ? (
                        <div className="space-y-2">
                          <Input value={edu.degree} onChange={(e) => updateCustomEdu(edu.id, "degree", e.target.value)} placeholder="Degree" className="h-8 text-sm" />
                          <Input value={edu.institution} onChange={(e) => updateCustomEdu(edu.id, "institution", e.target.value)} placeholder="Institution" className="h-8 text-sm" />
                          <div className="grid grid-cols-2 gap-2">
                            <Input type="date" value={edu.startDate} onChange={(e) => updateCustomEdu(edu.id, "startDate", e.target.value)} className="h-8 text-sm" />
                            <Input type="date" value={edu.endDate} onChange={(e) => updateCustomEdu(edu.id, "endDate", e.target.value)} disabled={edu.current} className="h-8 text-sm" />
                          </div>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={edu.current} onChange={(e) => updateCustomEdu(edu.id, "current", e.target.checked)} />
                            Currently studying
                          </label>
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => setEditingEduId(null)}>Done</Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteCustomEdu(edu.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-sm">{edu.degree || "Untitled"}</p>
                            <p className="text-xs text-muted-foreground">{edu.institution || "No institution"}</p>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => setEditingEduId(edu.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {profile.educations.length === 0 && customEducations.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No education yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── Skills ────────────────────────────────────────────────── */}
          {activeSection === "skills" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Skills</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addCustomSkill}>
                    <Plus className="h-4 w-4 mr-1" /> Custom
                  </Button>
                  <Link href="/dashboard/skills" target="_blank">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> Manage
                    </Button>
                  </Link>
                </div>
              </div>

              {/* DB skills */}
              {profile.skills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      From Profile ({profile.skills.length})
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {selectedSkillIds.length} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => {
                      const selected = selectedSkillIds.includes(skill.id);
                      return (
                        <button
                          key={skill.id}
                          onClick={() => toggleSkill(skill.id)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          {skill.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom skills */}
              {customSkills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Resume-only
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {customSkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-full border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800"
                      >
                        <Input
                          value={skill.title}
                          onChange={(e) => updateCustomSkill(skill.id, e.target.value)}
                          placeholder="Skill name"
                          className="h-5 w-24 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                        />
                        <button
                          onClick={() => deleteCustomSkill(skill.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.skills.length === 0 && customSkills.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Wrench className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No skills yet</p>
                </div>
              )}
            </div>
          )}

          {/* ── AI Insights ───────────────────────────────────────────── */}
          {activeSection === "ai" && (
            <div className="space-y-4">
              {savedContent.aiEvaluation ? (
                <>
                  {/* Match score */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Job Match</h3>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          color:
                            savedContent.aiEvaluation.evaluation.matchPercentage >= 70
                              ? "#16a34a"
                              : savedContent.aiEvaluation.evaluation.matchPercentage >= 40
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      >
                        {savedContent.aiEvaluation.evaluation.matchPercentage}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${savedContent.aiEvaluation.evaluation.matchPercentage}%`,
                          backgroundColor:
                            savedContent.aiEvaluation.evaluation.matchPercentage >= 70
                              ? "#16a34a"
                              : savedContent.aiEvaluation.evaluation.matchPercentage >= 40
                              ? "#d97706"
                              : "#dc2626",
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {savedContent.aiEvaluation.evaluation.overallAssessment}
                    </p>
                  </div>

                  {/* Strengths */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> Strengths
                    </h3>
                    <ul className="space-y-1">
                      {savedContent.aiEvaluation.evaluation.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" /> Gaps
                    </h3>
                    <ul className="space-y-1">
                      {savedContent.aiEvaluation.evaluation.gaps.map((g, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>{g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="rounded-lg border p-4 space-y-2">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" /> Recommendations
                    </h3>
                    <ul className="space-y-1">
                      {savedContent.aiEvaluation.evaluation.recommendations.map((r, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-amber-500 mt-0.5">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested new skills */}
                  {savedContent.aiEvaluation.suggestedNewSkills.length > 0 && (
                    <div className="rounded-lg border p-4 space-y-2">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" /> Suggested Skills to Add
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {savedContent.aiEvaluation.suggestedNewSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg space-y-2">
                  <Sparkles className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">No AI evaluation yet</p>
                  <p className="text-xs text-muted-foreground">
                    Use the{" "}
                    <Link href="/dashboard/job-evaluator" className="underline">
                      Job Evaluator
                    </Link>{" "}
                    to generate a tailored resume and AI insights will appear here.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right Preview ──────────────────────────────────────────────── */}
      <div className="flex-1 bg-muted/40 overflow-auto print:overflow-visible print:bg-white print:p-0">
        {/* Toolbar — hidden on print */}
        <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm border-b px-6 py-2 flex items-center justify-between print:hidden">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Preview</span>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-1.5" />
            Download PDF
          </Button>
        </div>

        {/* Scale wrapper — centres and shrinks the 794px sheet to fit the pane */}
        <div className="flex justify-center py-8 print:p-0 print:block">
          <ResumePreview
            personal={personal}
            summary={summary}
            experiences={previewExperiences}
            educations={previewEducations}
            skills={previewSkills}
            themeColor={resume.themeColor}
          />
        </div>
      </div>
    </div>
  );
}
