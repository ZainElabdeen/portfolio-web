"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { projectSchema } from "@/lib/validation";
import { z } from "zod";

type ProjectInput = z.infer<typeof projectSchema>;

type ActionResult =
  | { success: true }
  | { success: false; error: string };

export const getProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (data: ProjectInput): Promise<ActionResult> => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.project.create({ data: parsed.data });
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project";
    return { success: false, error: message };
  }
};

export const updateProject = async (id: string, data: ProjectInput): Promise<ActionResult> => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: parsed.data,
    });
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    return { success: false, error: message };
  }
};

export const deleteProject = async (id: string): Promise<ActionResult> => {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return { success: false, error: message };
  }
};
