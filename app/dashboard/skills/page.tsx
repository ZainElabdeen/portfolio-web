import prisma from "@/prisma/client";
import SkillForm from "./skill-form";
import SkillItem from "./skill-item";
import { Wrench } from "lucide-react";

const SkillsPage = async () => {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
        <p className="text-muted-foreground">
          Manage your technical skills and abilities.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-md">
        <SkillForm />
        <div className="min-h-[300px] max-h-[50vh] border rounded-lg p-4 bg-card overflow-y-auto">
          {skills.length > 0 ? (
            <div className="flex flex-col gap-2">
              {skills.map((skill) => (
                <SkillItem key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[250px] flex-col items-center justify-center text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No skills added</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your first skill using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
