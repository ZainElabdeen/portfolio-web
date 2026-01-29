import { NextRequest, NextResponse } from "next/server";

import { ObjectIdSchema, projectSchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const validId = ObjectIdSchema.safeParse(id);
  if (!validId.success) {
    return NextResponse.json(
      { error: "Invalid project ID format" },
      { status: 404 }
    );
  }

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validId = ObjectIdSchema.safeParse(id);
    if (!validId.success) {
      return NextResponse.json(
        { error: "Invalid project ID format" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const data = projectSchema.partial().parse(body);
    const updatedProject = await prisma.project.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const validId = ObjectIdSchema.safeParse(id);
  if (!validId.success) {
    return NextResponse.json(
      { error: "Invalid project ID format" },
      { status: 404 }
    );
  }
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
