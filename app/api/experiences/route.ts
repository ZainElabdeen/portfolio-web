import { experienceSchema } from "@/lib/validation";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: "desc" },
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = experienceSchema.parse(body);

    const formattedData = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data?.endDate ? new Date(data?.endDate) : null,
    };

    const newExperience = await prisma.experience.create({
      data: formattedData,
    });
    return NextResponse.json(newExperience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 },
    );
  }
}
