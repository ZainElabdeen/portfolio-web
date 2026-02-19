export function buildSystemPrompt(): string {
  return `You are an expert career advisor and resume consultant. You will be given a job description and a candidate's full profile data. Your job is to:

1. Evaluate the candidate's fit for the role
2. Suggest a tailored resume using ONLY their existing data (selecting the most relevant items by their IDs)
3. Identify skill gaps and suggest new skills

You MUST respond with valid JSON matching this exact schema:
{
  "evaluation": {
    "matchPercentage": <number 0-100>,
    "overallAssessment": "<2-3 sentence summary>",
    "strengths": ["<strength 1>", "<strength 2>", ...],
    "gaps": ["<gap 1>", "<gap 2>", ...],
    "recommendations": ["<recommendation 1>", ...]
  },
  "suggestedResume": {
    "resumeTitle": "<suggested resume title for this job>",
    "summary": "<tailored professional summary written in first person>",
    "selectedExperienceIds": ["<id1>", "<id2>"],
    "selectedEducationIds": ["<id1>"],
    "selectedSkillIds": ["<id1>", "<id2>", ...]
  },
  "suggestedNewSkills": ["<skill name 1>", "<skill name 2>", ...]
}

IMPORTANT RULES:
- For selectedExperienceIds, selectedEducationIds, and selectedSkillIds, ONLY use the exact IDs provided in the candidate data
- Order selected items by relevance to the job (most relevant first)
- suggestedNewSkills should ONLY include skills NOT already in the candidate's profile
- The summary should be tailored specifically to the job description, written in first person, referencing the candidate's actual experience
- Be honest and realistic about the match percentage - do not inflate it
- Respond with ONLY the JSON object, no markdown code fences, no explanation, no extra text`;
}

function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength) + "...";
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export function buildUserPrompt(
  jobDescription: string,
  profileData: {
    profile: {
      fullName: string;
      email: string;
      title?: string | null;
      location?: string | null;
      yearsOfExp?: number | null;
      summary?: string | null;
    };
    experiences: Array<{
      id: string;
      title: string;
      companyName?: string | null;
      location?: string | null;
      locationType?: string | null;
      employmentType?: string | null;
      description: string;
      startDate: Date | string;
      endDate?: Date | string | null;
      current: boolean;
    }>;
    educations: Array<{
      id: string;
      institution: string;
      degree: string;
      description?: string | null;
      startDate: Date | string;
      endDate?: Date | string | null;
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
): string {
  const { profile, experiences, educations, skills, projects } = profileData;

  const experiencesList = experiences
    .map(
      (e) =>
        `- ID: "${e.id}" | ${e.title} at ${e.companyName || "N/A"} (${formatDate(e.startDate)} - ${e.current ? "Present" : formatDate(e.endDate)}) | ${e.employmentType || ""} ${e.locationType || ""}\n  Description: ${truncate(e.description, 500)}`
    )
    .join("\n");

  const educationsList = educations
    .map(
      (e) =>
        `- ID: "${e.id}" | ${e.degree} at ${e.institution} (${formatDate(e.startDate)} - ${e.current ? "Present" : formatDate(e.endDate)})${e.description ? `\n  ${truncate(e.description, 300)}` : ""}`
    )
    .join("\n");

  const skillsList = skills.map((s) => `- ID: "${s.id}" | ${s.title}`).join("\n");

  const projectsList = projects
    .map(
      (p) =>
        `- ${p.title}: ${truncate(p.description, 300)} | Tags: ${p.tags.join(", ")}`
    )
    .join("\n");

  return `## JOB DESCRIPTION
${jobDescription}

## CANDIDATE PROFILE
Name: ${profile.fullName}
Title: ${profile.title || "Not specified"}
Email: ${profile.email}
Location: ${profile.location || "Not specified"}
Years of Experience: ${profile.yearsOfExp || "Not specified"}
Current Summary: ${profile.summary ? truncate(profile.summary, 500) : "None"}

## EXPERIENCES
${experiencesList || "No experiences listed."}

## EDUCATION
${educationsList || "No education listed."}

## SKILLS
${skillsList || "No skills listed."}

## PROJECTS
${projectsList || "No projects listed."}

Analyze this candidate's fit for the job and provide your structured evaluation as JSON.`;
}
