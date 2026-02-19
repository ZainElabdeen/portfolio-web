import { NextRequest, NextResponse } from "next/server";
import { projectSchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const projects = await prisma.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = projectSchema.parse(body);
    const newProject = await prisma.project.create({ 
      data,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}
