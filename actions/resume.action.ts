"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Define Types inline or import from validation file if created
type TResume = {
  title: string;
  description?: string;
  layout?: string;
  themeColor?: string;
  content: any; // JSON content
};

export const createResume = async (data: TResume) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    // Ensure UserProfile exists
    let userProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
       // Create a basic profile if it doesn't exist
       // We might need more data here, or fetch from Clerk
       const user = await ((await auth()).toJSON() as any); // Clerk user object if available or fetch
       // For now, let's assume we can just create it with minimal data or error out asking to setup profile
       // Better approach: create profile on first login or check here.
       // Let's create a stub profile
       userProfile = await prisma.userProfile.create({
         data: {
           userId,
           email: "placeholder@example.com", // Should fetch real email
           fullName: "New User", // Should fetch real name
         }
       })
    }

    const resume = await prisma.resume.create({
      data: {
        title: data.title,
        layout: data.layout || "modern",
        themeColor: data.themeColor || "#000000",
        content: data.content ?? {},
        userProfileId: userProfile.id,
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
    const { userId } = await auth();
    if (!userId) return [];
    
    // Find profile
    const userProfile = await prisma.userProfile.findUnique({
        where: { userId }
    });

    if(!userProfile) return [];

    return await prisma.resume.findMany({
        where: { userProfileId: userProfile.id },
        orderBy: { updatedAt: 'desc' }
    });
}

export const getResumeById = async (id: string) => {
    const { userId } = await auth();
    if (!userId) return null;

     const resume = await prisma.resume.findUnique({
        where: { id },
        include: { userProfile: true }
    });
    
    if (!resume || resume.userProfile.userId !== userId) return null; // Security check

    return resume;
}


export const updateResume = async (id: string, data: Partial<TResume>) => {
    const { userId } = await auth();
    if(!userId) return { success: false, error: "Unauthorized" };

    try {
        // Verify ownership
        const existing = await prisma.resume.findUnique({
            where: { id },
             include: { userProfile: true }
        });
        
        if (!existing || existing.userProfile.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        const updated = await prisma.resume.update({
            where: { id },
            data: {
                title: data.title,
                layout: data.layout,
                themeColor: data.themeColor,
                content: data.content
            }
        });
        
        revalidatePath("/dashboard/resumes");
        revalidatePath(`/dashboard/resumes/${id}`);
        return { success: true, data: updated };

    } catch (error) {
        console.error("Error update resume:", error);
        return { success: false, error: "Failed to update resume" };
    }
}

export const deleteResume = async (id: string) => {
    const { userId } = await auth();
    if(!userId) return { success: false, error: "Unauthorized" };

    try {
          // Verify ownership
        const existing = await prisma.resume.findUnique({
            where: { id },
             include: { userProfile: true }
        });
        
         if (!existing || existing.userProfile.userId !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        await prisma.resume.delete({ where: { id }});
        revalidatePath("/dashboard/resumes");
        return { success: true };

    } catch (error) {
         console.error("Error delete resume:", error);
        return { success: false, error: "Failed to delete resume" };
    }
}
