"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { projectSchema, TProject } from "@/lib/validation";

type ActionResult = { success: true } | { success: false; error: string };

export const getProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (data: TProject): Promise<ActionResult> => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.project.create({
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        tags: parsed.data.tags,
        imageUrl: parsed.data.imageUrl || null,
        liveUrl: parsed.data.liveUrl || null,
        githubUrl: parsed.data.githubUrl || null,
        order: parsed.data.order,
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create project";
    return { success: false, error: message };
  }
};

export const updateProject = async (
  id: string,
  data: TProject
): Promise<ActionResult> => {
  const parsed = projectSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        tags: parsed.data.tags,
        imageUrl: parsed.data.imageUrl || null,
        liveUrl: parsed.data.liveUrl || null,
        githubUrl: parsed.data.githubUrl || null,
        order: parsed.data.order,
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update project";
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
    const message =
      error instanceof Error ? error.message : "Failed to delete project";
    return { success: false, error: message };
  }
};
