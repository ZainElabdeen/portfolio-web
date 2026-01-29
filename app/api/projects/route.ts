import { NextRequest, NextResponse } from "next/server";

import { projectSchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET() {
  const experiences = await prisma.project.findMany();
  return NextResponse.json(experiences);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = projectSchema.parse(body);
    const newProject = await prisma.project.create({ data });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}
