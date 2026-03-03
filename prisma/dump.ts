import { PrismaClient } from "../prisma/generated/client";
import { writeFileSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient();

async function main() {
  const [profile, experience, education, skill, project, resume] =
    await Promise.all([
      prisma.profile.findMany(),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({ orderBy: { order: "asc" } }),
      prisma.resume.findMany(),
    ]);

  const data = { profile, experience, education, skill, project, resume };
  const date = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const outPath = resolve(__dirname, `../backup/backup-${date}.json`);

  writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`✅ Backup saved to: ${outPath}`);
  console.log(
    `   profile: ${profile.length}, experience: ${experience.length}, education: ${education.length}, skill: ${skill.length}, project: ${project.length}, resume: ${resume.length}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Backup failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
