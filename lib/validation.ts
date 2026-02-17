import { z } from "zod";

// Experience validation
export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  companyName: z.string().optional(),
  location: z.string().optional(),
  locationType: z.enum(["Remote", "Onsite", "Hybrid"]).optional(),
  employmentType: z
    .enum(["Full-time", "Part-time", "Contract", "Intern", "Freelance"])
    .optional(),
  description: z.string().min(1, "Description is required"),
  icon: z.string().optional(),
  companyLogoUrl: z.string().optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid end date",
    }),
  current: z.boolean(),
  order: z.number().optional(),
});

export type TExperience = z.infer<typeof experienceSchema>;

// Skill validation
export const skillSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number().optional(),
});

export const skillsArraySchema = z.array(skillSchema);

export type TSkill = z.infer<typeof skillSchema>;

// Project validation
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  imageUrl: z.string().optional(),
  liveUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  order: z.number().optional(),
});

export type TProject = z.infer<typeof projectSchema>;

// Education validation
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date",
  }),
  endDate: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid end date",
    }),
  current: z.boolean(),
  description: z.string().optional(),
  order: z.number().optional(),
});

export type TEducation = z.infer<typeof educationSchema>;

// Profile validation
export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  summary: z.string().optional(),
  title: z.string().optional(),
  yearsOfExp: z.number().optional(),
  introText: z.string().optional(),
  profileImageUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  linkedinUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  aboutText: z.string().optional(),
  location: z.string().optional(),
});

export type TProfile = z.infer<typeof profileSchema>;

// Common validation
export const ObjectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, {
  message: "Invalid ID format",
});
