"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { profileSchema, TProfile } from "@/lib/validation";

// Public getter for main page (no auth required)
export const getPublicProfile = async () => {
  try {
    const profile = await prisma.profile.findFirst();
    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

export const getUserProfile = async () => {
  try {
    const profile = await prisma.profile.findFirst();
    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
};

export const createUserProfile = async (data: TProfile) => {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.profile.create({
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
      error instanceof Error ? error.message : "Failed to create profile";
    return { success: false, error: message };
  }
};

export const updateUserProfile = async (id: string, data: TProfile) => {
  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  try {
    await prisma.profile.update({
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
};
