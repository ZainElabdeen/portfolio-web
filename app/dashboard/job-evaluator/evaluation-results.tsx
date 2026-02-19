"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  FileText,
  Plus,
  Loader2,
  Briefcase,
  GraduationCap,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

import { type TAIEvaluationResponse } from "@/lib/validation";
import { createSkillsBulk } from "@/actions/skill.action";

interface ProfileData {
  fullName: string;
  email: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  experiences: Array<{
    id: string;
    title: string;
    companyName?: string | null;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
  }>;
  skills: Array<{
    id: string;
    title: string;
  }>;
}

interface EvaluationResultsProps {
  result: TAIEvaluationResponse;
  profile: ProfileData;
  onCreateResume: () => void;
  isCreatingResume: boolean;
}

function getMatchColor(percentage: number) {
  if (percentage >= 70) return "text-green-600 dark:text-green-400";
  if (percentage >= 40) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getMatchBg(percentage: number) {
  if (percentage >= 70) return "bg-green-100 dark:bg-green-900/30";
  if (percentage >= 40) return "bg-yellow-100 dark:bg-yellow-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

export default function EvaluationResults({
  result,
  profile,
  onCreateResume,
  isCreatingResume,
}: EvaluationResultsProps) {
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(
    new Set(result.suggestedNewSkills)
  );
  const [isSavingSkills, setIsSavingSkills] = useState(false);
  const [skillsSaved, setSkillsSaved] = useState(false);

  const existingSkillTitles = new Set(profile.skills.map((s) => s.title));

  // Resolve IDs to names
  const selectedExperiences = result.suggestedResume.selectedExperienceIds
    .map((id) => profile.experiences.find((e) => e.id === id))
    .filter(Boolean);

  const selectedEducations = result.suggestedResume.selectedEducationIds
    .map((id) => profile.educations.find((e) => e.id === id))
    .filter(Boolean);

  const selectedSkillItems = result.suggestedResume.selectedSkillIds
    .map((id) => profile.skills.find((s) => s.id === id))
    .filter(Boolean);

  // Filter out skills already in profile
  const newSkills = result.suggestedNewSkills.filter(
    (s) => !existingSkillTitles.has(s)
  );

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });
  };

  const handleSaveSkills = async () => {
    const skills = Array.from(selectedSkills);
    if (skills.length === 0) {
      toast.error("No skills selected");
      return;
    }

    setIsSavingSkills(true);
    try {
      const res = await createSkillsBulk(skills);
      if (res.success) {
        toast.success(`Added ${res.created} new skill${res.created !== 1 ? "s" : ""}`);
        setSkillsSaved(true);
      } else {
        toast.error(res.error || "Failed to add skills");
      }
    } catch {
      toast.error("Failed to add skills");
    } finally {
      setIsSavingSkills(false);
    }
  };

  return (
    <Tabs defaultValue="evaluation" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
        <TabsTrigger value="resume">Suggested Resume</TabsTrigger>
        <TabsTrigger value="skills">
          Skill Gaps
          {newSkills.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {newSkills.length}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      {/* Evaluation Tab */}
      <TabsContent value="evaluation" className="space-y-4">
        {/* Match Percentage */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`flex items-center justify-center w-28 h-28 rounded-full ${getMatchBg(result.evaluation.matchPercentage)}`}
              >
                <span
                  className={`text-4xl font-bold ${getMatchColor(result.evaluation.matchPercentage)}`}
                >
                  {result.evaluation.matchPercentage}%
                </span>
              </div>
              <p className="text-center text-muted-foreground max-w-lg">
                {result.evaluation.overallAssessment}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.evaluation.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.evaluation.gaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  {gap}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.evaluation.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Suggested Resume Tab */}
      <TabsContent value="resume" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {result.suggestedResume.resumeTitle}
            </CardTitle>
            <CardDescription>
              AI-tailored resume based on the job requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Professional Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.suggestedResume.summary}
              </p>
            </div>

            {/* Selected Experiences */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Selected Experiences ({selectedExperiences.length})
              </h4>
              <ul className="space-y-1">
                {selectedExperiences.map((exp) => (
                  <li
                    key={exp!.id}
                    className="text-sm flex items-center gap-2 py-1 px-2 rounded bg-muted/50"
                  >
                    <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="font-medium">{exp!.title}</span>
                    {exp!.companyName && (
                      <span className="text-muted-foreground">
                        at {exp!.companyName}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Selected Education */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Selected Education ({selectedEducations.length})
              </h4>
              <ul className="space-y-1">
                {selectedEducations.map((edu) => (
                  <li
                    key={edu!.id}
                    className="text-sm flex items-center gap-2 py-1 px-2 rounded bg-muted/50"
                  >
                    <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="font-medium">{edu!.degree}</span>
                    <span className="text-muted-foreground">
                      at {edu!.institution}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Selected Skills */}
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Selected Skills ({selectedSkillItems.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSkillItems.map((skill) => (
                  <Badge key={skill!.id} variant="secondary">
                    {skill!.title}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={onCreateResume}
              disabled={isCreatingResume}
              className="w-full"
            >
              {isCreatingResume ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Resume...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create This Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Skill Gaps Tab */}
      <TabsContent value="skills" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Suggested New Skills
            </CardTitle>
            <CardDescription>
              These skills were mentioned in the job description but are not in
              your profile. Select which ones to add.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {newSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No new skills suggested - your profile already covers the
                required skills!
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {newSkills.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={selectedSkills.has(skill)}
                        onCheckedChange={() => toggleSkill(skill)}
                        disabled={skillsSaved}
                      />
                      <span className="text-sm font-medium">{skill}</span>
                    </label>
                  ))}
                </div>

                <Button
                  onClick={handleSaveSkills}
                  disabled={
                    isSavingSkills || skillsSaved || selectedSkills.size === 0
                  }
                  className="w-full"
                  variant={skillsSaved ? "outline" : "default"}
                >
                  {isSavingSkills ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Skills...
                    </>
                  ) : skillsSaved ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Skills Added
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Selected Skills ({selectedSkills.size})
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
