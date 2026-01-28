import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FolderKanban, Wrench, FileText } from "lucide-react";
import prisma from "@/prisma/client";

export default async function Page() {
  const [projectsCount, experiencesCount, skillsCount] = await Promise.all([
    prisma.project.count(),
    prisma.experience.count(),
    prisma.skill.count(),
  ]);

  const stats = [
    {
      title: "Projects",
      count: projectsCount,
      icon: FolderKanban,
      href: "/dashboard/projects",
      description: "Showcase your work",
    },
    {
      title: "Experience",
      count: experiencesCount,
      icon: Briefcase,
      href: "/dashboard/experience",
      description: "Your work history",
    },
    {
      title: "Skills",
      count: skillsCount,
      icon: Wrench,
      href: "/dashboard/skills",
      description: "Technical abilities",
    },
    {
      title: "Resumes",
      count: 0,
      icon: FileText,
      href: "/dashboard/resumes",
      description: "Generated CVs",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Manage your portfolio content and generate resumes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
