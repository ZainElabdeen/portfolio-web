"use server";

import prisma from "@/prisma/client";
import { experienceSchema, TExperience } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const getExperiences = async () => {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return experiences;
  } catch (error) {
    console.error("Failed to fetch experiences:", error);
    return [];
  }
};

export const createExperience = async (data: TExperience) => {
  const parsed = experienceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.experience.create({
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/experience");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create experience";
    return { success: false, error: message };
  }
};

export const updateExperience = async (id: string, data: TExperience) => {
  const parsed = experienceSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.experience.update({
      where: { id },
      data: {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: new Date(parsed.data.endDate),
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/experience");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update experience";
    return { success: false, error: message };
  }
};

export const deleteExperience = async (id: string) => {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/experience");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete experience";
    return { success: false, error: message };
  }
};
