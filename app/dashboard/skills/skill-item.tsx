"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { deleteSkill } from "@/actions/skill.action";

interface Skill {
  id: string;
  title: string;
  order: number | null;
}

const SkillItem = ({ skill }: { skill: Skill }) => {
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this skill?")) {
      await deleteSkill(skill.id);
    }
  };

  return (
    <div className="flex items-center justify-between bg-accent/50 border rounded-lg px-4 py-2">
      <span className="text-sm font-medium">{skill.title}</span>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => console.log(`Edit ${skill.id}`)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default SkillItem;
