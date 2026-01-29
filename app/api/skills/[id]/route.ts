import { NextRequest, NextResponse } from "next/server";

import { skillSchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) return NextResponse.json({ error: "Not Found" }, { status: 404 });
  return NextResponse.json(skill);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = skillSchema.partial().parse(body);
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedSkill);
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
  await prisma.skill.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
