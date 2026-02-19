"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

type TResume = {
  title: string;
  description?: string;
  layout?: string;
  themeColor?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  experienceIds?: string[];
  educationIds?: string[];
  skillIds?: string[];
  projectIds?: string[];
};

export const createResume = async (data: TResume) => {
  try {
    const resume = await prisma.resume.create({
      data: {
        title: data.title,
        layout: data.layout || "modern",
        themeColor: data.themeColor || "#000000",
        content: data.content ?? {},
        experienceIds: data.experienceIds || [],
        educationIds: data.educationIds || [],
        skillIds: data.skillIds || [],
        projectIds: data.projectIds || [],
      },
    });

    revalidatePath("/dashboard/resumes");
    return { success: true, data: resume };
  } catch (error) {
    console.error("Error creating resume:", error);
    return { success: false, error: "Failed to create resume" };
  }
};

export const getResumes = async () => {
  try {
    return await prisma.resume.findMany({
      orderBy: { updatedAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch resumes:", error);
    return [];
  }
};

export const getResumeById = async (id: string) => {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    return resume;
  } catch (error) {
    console.error("Failed to fetch resume:", error);
    return null;
  }
};

export const updateResume = async (id: string, data: Partial<TResume>) => {
  try {
    const updated = await prisma.resume.update({
      where: { id },
      data: {
        title: data.title,
        layout: data.layout,
        themeColor: data.themeColor,
        content: data.content,
        experienceIds: data.experienceIds,
        educationIds: data.educationIds,
        skillIds: data.skillIds,
        projectIds: data.projectIds,
      },
    });

    revalidatePath("/dashboard/resumes");
    revalidatePath(`/dashboard/resumes/${id}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error update resume:", error);
    return { success: false, error: "Failed to update resume" };
  }
};

export const deleteResume = async (id: string) => {
  try {
    await prisma.resume.delete({ where: { id } });
    revalidatePath("/dashboard/resumes");
    return { success: true };
  } catch (error) {
    console.error("Error delete resume:", error);
    return { success: false, error: "Failed to delete resume" };
  }
};
