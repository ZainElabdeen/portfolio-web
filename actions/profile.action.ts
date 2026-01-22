"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ensureUserProfile = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  let profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  if (!profile) {
    const email = user.emailAddresses[0]?.emailAddress ?? "";
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();

    profile = await prisma.userProfile.create({
      data: {
        userId: user.id,
        email,
        fullName,
      },
    });
  }

  return profile;
};

export const getUserProfile = async () => {
    const { userId } = await auth();
    if (!userId) return null;
    return await prisma.userProfile.findUnique({
        where: { userId },
        include: {
            experiences: true,
            educations: true,
            skills: true,
            projects: true
        }
    })
}

export const updateUserProfile = async (data: any) => {
     const { userId } = await auth();
     if(!userId) return { success: false };
     
     try {
         await prisma.userProfile.update({
             where: { userId },
             data: {
                 ...data
             }
         });
         revalidatePath("/dashboard/profile");
         return { success: true };
     } catch (e) {
         return { success: false, error: e };
     }
}
