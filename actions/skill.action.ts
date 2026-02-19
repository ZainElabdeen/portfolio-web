"use server";

import { TSkill } from "@/lib/validation";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const getSkills = async () => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: "asc" },
    });
    return skills;
  } catch (error) {
    console.error("Failed to fetch skills:", error);
    return [];
  }
};

export const createSkill = async (formData: TSkill) => {
  try {
    await prisma.skill.create({ 
      data: formData
    });
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create skill";
    return { success: false, error: message };
  }
};

export const createSkillsBulk = async (skills: string[]) => {
  try {
    // Filter out duplicates and get existing skills
    const existingSkills = await prisma.skill.findMany({
      where: { 
        title: { in: skills }
      },
      select: { title: true },
    });
    const existingTitles = new Set(existingSkills.map((s) => s.title));

    // Only create skills that don't already exist
    const newSkills = skills.filter((title) => !existingTitles.has(title));

    if (newSkills.length > 0) {
      await prisma.skill.createMany({
        data: newSkills.map((title) => ({ title })),
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return {
      success: true,
      created: newSkills.length,
      skipped: skills.length - newSkills.length,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create skills";
    return { success: false, error: message };
  }
};

export const deleteSkill = async (id: string) => {
  try {
    await prisma.skill.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete skill";
    return { success: false, error: message };
  }
};
