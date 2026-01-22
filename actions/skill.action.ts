"use server";

import { TSkill } from "@/lib/validation";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export const createSkill = async (formData: TSkill) => {
    try {
        await prisma.skill.create({ data: formData });
        revalidatePath('/dashboard/skills')
    } catch (error) {
        console.log('error', error)
    }
}