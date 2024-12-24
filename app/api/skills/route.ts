import { NextRequest, NextResponse } from "next/server";

import { skillsArraySchema } from "@/lib/validation";
import prisma from "@/prisma/client";

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  console.log('skills >>>>>>. ', skills)
  return NextResponse.json(skills);
}

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const data = skillSchema.parse(body);

//     // Auto-increment order
//     const maxOrder = await prisma.skill.aggregate({ _max: { order: true } });
//     data.order = (maxOrder._max.order || 0) + 1;

//     const newSkill = await prisma.skill.create({ data });
//     return NextResponse.json(newSkill, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Validation failed", details: error },
//       { status: 400 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {

    const body = await request.json();
    console.log('body >>>>>>>>>>>>>> ', body)

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
    return NextResponse.json(
      { error: "Validation failed", details: error },
      { status: 400 }
    );
  }
}