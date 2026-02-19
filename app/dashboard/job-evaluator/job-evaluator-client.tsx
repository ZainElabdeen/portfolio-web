"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AI_PROVIDERS } from "@/lib/ai-providers";
import {
  jobEvaluationFormSchema,
  type TJobEvaluationForm,
  type TAIEvaluationResponse,
} from "@/lib/validation";
import { createResume } from "@/actions/resume.action";
import EvaluationResults from "./evaluation-results";

interface ProfileData {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  summary?: string | null;
  title?: string | null;
  yearsOfExp?: number | null;
  location?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  experiences: Array<{
    id: string;
    title: string;
    companyName?: string | null;
    location?: string | null;
    locationType?: string | null;
    employmentType?: string | null;
    description: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    description?: string | null;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
  }>;
  skills: Array<{
    id: string;
    title: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    tags: string[];
  }>;
}

interface JobEvaluatorClientProps {
  profile: ProfileData;
}

function extractJSON(text: string): string {
  // Strip markdown code fences that Gemini/Claude sometimes add
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  // Fall back to first { ... } block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
}

export default function JobEvaluatorClient({
  profile,
}: JobEvaluatorClientProps) {
  const [result, setResult] = useState<TAIEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);

  const form = useForm<TJobEvaluationForm>({
    resolver: zodResolver(jobEvaluationFormSchema),
    defaultValues: {
      jobDescription: "",
      provider: "openai",
    },
  });

  const onSubmit = async (data: TJobEvaluationForm) => {
    setResult(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/evaluate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: data.provider,
          jobDescription: data.jobDescription,
          profileData: {
            profile: {
              fullName: profile.fullName,
              email: profile.email,
              title: profile.title,
              location: profile.location,
              yearsOfExp: profile.yearsOfExp,
              summary: profile.summary,
            },
            experiences: profile.experiences,
            educations: profile.educations,
            skills: profile.skills,
            projects: profile.projects,
          },
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        // Try to parse error JSON from the response body
        try {
          const errData = JSON.parse(text);
          throw new Error(errData.error || `Server error ${res.status}`);
        } catch {
          throw new Error(text || `Server error ${res.status}`);
        }
      }

      const jsonStr = extractJSON(text);
      const parsed = JSON.parse(jsonStr) as TAIEvaluationResponse;

      if (!parsed.evaluation || !parsed.suggestedResume) {
        throw new Error("Incomplete response from AI. Please try again.");
      }

      setResult(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to get AI evaluation";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    if (!result) return;

    setIsCreatingResume(true);
    try {
      const resumeResult = await createResume({
        title: result.suggestedResume.resumeTitle,
        experienceIds: result.suggestedResume.selectedExperienceIds,
        educationIds: result.suggestedResume.selectedEducationIds,
        skillIds: result.suggestedResume.selectedSkillIds,
        content: {
          personal: {
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone || "",
            location: profile.location || "",
            linkedin: profile.linkedinUrl || "",
            website: profile.githubUrl || "",
          },
          summary: result.suggestedResume.summary,
          // Store the full AI evaluation — resume editor uses this to avoid
          // re-calling the AI and to show improvement suggestions
          aiEvaluation: result,
        },
      });

      if (resumeResult.success && resumeResult.data) {
        toast.success("Resume created! Opening in new tab…");
        window.open(`/dashboard/resumes/${resumeResult.data.id}`, "_blank");
      } else {
        toast.error(resumeResult.error || "Failed to create resume");
      }
    } catch {
      toast.error("Failed to create resume");
    } finally {
      setIsCreatingResume(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Job Description
          </CardTitle>
          <CardDescription>
            Paste the job requirements below and select an AI provider to
            evaluate your fit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the full job description or requirements here..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>AI Provider</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select AI provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AI_PROVIDERS.map((p) => (
                            <SelectItem key={p.value} value={p.value}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Evaluate My Fit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && !result && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">
              AI is analyzing your profile against the job requirements...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <EvaluationResults
          result={result}
          profile={profile}
          onCreateResume={handleCreateResume}
          isCreatingResume={isCreatingResume}
        />
      )}
    </div>
  );
}
