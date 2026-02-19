import { NextRequest, NextResponse } from "next/server";
import { skillsArraySchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ 
      orderBy: { order: "asc" } 
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the input array
    const skills = skillsArraySchema.parse(body);

    // Fetch the current max order from the database
    const maxOrderResult = await prisma.skill.aggregate({ _max: { order: true } });
    let currentOrder = maxOrderResult._max.order || 0;

    // Add the `order` field to each skill
    const skillsWithOrder = skills.map((skill) => {
      currentOrder += 1;
      return { ...skill, order: currentOrder };
    });

    // Insert all skills using createMany
    const createdSkills = await prisma.skill.createMany({
      data: skillsWithOrder,
    });

    return NextResponse.json(createdSkills, { status: 201 });
  } catch (error) {
    console.error("Error creating skills:", error);
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}
