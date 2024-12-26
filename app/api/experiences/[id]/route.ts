import { NextRequest, NextResponse } from "next/server";

import { experienceSchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const experience = await prisma.experience.findUnique({ where: { id } });
  if (!experience)
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(experience);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = experienceSchema.partial().parse(body);
    const updatedExperience = await prisma.experience.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedExperience);
  } catch (error) {
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  await prisma.experience.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
