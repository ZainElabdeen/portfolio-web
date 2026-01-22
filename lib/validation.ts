import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string(),
  location: z.string(),
  description: z.string(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid startDate",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid endDate",
  }),
  icon: z.string().optional(),
});

export type TExperience = z.infer<typeof experienceSchema>;

export const skillSchema = z.object({
  title: z.string(),
  order: z.number().optional(),
});

export const skillsArraySchema = z.array(skillSchema);

export type TSkill = z.infer<typeof skillSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string().min(1, "Tag cannot be empty")),
  imageUrl: z.string(),
  // .url("Invalid image URL"),
});

export const ObjectIdSchema = z.string().regex(/^[a-fA-F0-9]{24}$/, {
  message: "Invalid project ID format",
});
