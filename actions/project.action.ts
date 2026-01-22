"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const getProjects = async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        // You might want to add an 'order' field or sort by date if available
        // For now, no specific order or by creation default
        id: 'desc' 
      },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const createProject = async (data: any) => {
    // Add auth check here if needed
    try {
        await prisma.project.create({ data });
        revalidatePath("/");
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export const updateProject = async (id: string, data: any) => {
    try {
        await prisma.project.update({
            where: { id },
            data,
        });
        revalidatePath("/");
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export const deleteProject = async (id: string) => {
    try {
        await prisma.project.delete({
            where: { id },
        });
        revalidatePath("/");
        revalidatePath("/dashboard/projects");
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}
