"use client";

import { Button } from "@/components/ui/button";
import { Skill } from "@prisma/client";

const SkillItem = ({ skill }: { skill: Skill }) => {
  return (
    <div
      key={skill.id}
      className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 shadow-sm"
    >
      <span className="text-sm font-medium text-gray-700">{skill.title}</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
          onClick={() => console.log(`Edit ${skill.id}`)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => console.log(`Delete ${skill.id}`)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default SkillItem;
