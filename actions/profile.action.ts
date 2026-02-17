"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profileSchema, TProfile } from "@/lib/validation";

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

// Public getter for main page (no auth required)
export const getPublicProfile = async () => {
  try {
    const profile = await prisma.userProfile.findFirst();
    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
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
      projects: true,
    },
  });
};

export const updateUserProfile = async (id: string, data: TProfile) => {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.userProfile.update({
      where: { id },
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        summary: parsed.data.summary || null,
        title: parsed.data.title || null,
        yearsOfExp: parsed.data.yearsOfExp || null,
        introText: parsed.data.introText || null,
        profileImageUrl: parsed.data.profileImageUrl || null,
        cvUrl: parsed.data.cvUrl || null,
        linkedinUrl: parsed.data.linkedinUrl || null,
        githubUrl: parsed.data.githubUrl || null,
        aboutText: parsed.data.aboutText || null,
        location: parsed.data.location || null,
      },
    });
    revalidatePath("/");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: message };
  }
}
