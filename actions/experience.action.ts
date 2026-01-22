"use server";
import prisma from "@/prisma/client";
import { experienceSchema, TExperience } from "@/lib/validation";


export const createExperience = async (formData: FormData) => {
  try {
    const data: TExperience = experienceSchema.parse({
      title: formData.get("title") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      icon: formData.get("icon") as string,
    });
    await prisma.experience.create({
      data,
    });
  } catch (error) {
    console.log("error", error);
  }
};

