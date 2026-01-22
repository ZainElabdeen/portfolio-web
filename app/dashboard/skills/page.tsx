import prisma from "@/prisma/client";
import SkillForm from "./skill-form";
import SkillItem from "./skill-item";

const SkillsPage = async () => {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <SkillForm />
      <div className="h-[50vh] border border-gray-300 rounded-lg p-4 bg-white shadow-sm overflow-y-auto">
        {skills.length > 0 ? (
          <div className="flex flex-col gap-2">
            {skills.map((skill) => (
              <SkillItem key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsPage;
