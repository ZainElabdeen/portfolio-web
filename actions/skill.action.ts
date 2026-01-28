"use server";

import { TSkill } from "@/lib/validation";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const createSkill = async (formData: TSkill) => {
  try {
    await prisma.skill.create({ data: formData });
    revalidatePath("/");
    revalidatePath("/dashboard/skills");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create skill";
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
    const message = error instanceof Error ? error.message : "Failed to delete skill";
    return { success: false, error: message };
  }
};