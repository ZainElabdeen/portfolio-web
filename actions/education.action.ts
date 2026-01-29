"use server";

import prisma from "@/prisma/client";
import { educationSchema, TEducation } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const getEducations = async () => {
  try {
    const educations = await prisma.education.findMany({
      orderBy: [{ current: "desc" }, { startDate: "desc" }],
    });
    return educations;
  } catch (error) {
    console.error("Failed to fetch educations:", error);
    return [];
  }
};

export const createEducation = async (data: TEducation) => {
  const parsed = educationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.education.create({
      data: {
        institution: parsed.data.institution,
        degree: parsed.data.degree,
        description: parsed.data.description || null,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        current: parsed.data.current || false,
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/education");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create education";
    return { success: false, error: message };
  }
};

export const updateEducation = async (id: string, data: TEducation) => {
  const parsed = educationSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.education.update({
      where: { id },
      data: {
        institution: parsed.data.institution,
        degree: parsed.data.degree,
        description: parsed.data.description || null,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        current: parsed.data.current || false,
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/education");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update education";
    return { success: false, error: message };
  }
};

export const deleteEducation = async (id: string) => {
  try {
    await prisma.education.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/education");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete education";
    return { success: false, error: message };
  }
};
