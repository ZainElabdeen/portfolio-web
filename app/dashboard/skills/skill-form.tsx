"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSkill, createSkillsBulk } from "@/actions/skill.action";

const SkillForm = () => {
  const [singleSkill, setSingleSkill] = useState("");
  const [bulkSkills, setBulkSkills] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleSkill.trim()) return;

    setIsSubmitting(true);
    await createSkill({ title: singleSkill.trim() });
    setSingleSkill("");
    setIsSubmitting(false);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkSkills.trim()) return;

    setIsSubmitting(true);
    // Split by comma or newline, trim, and filter empty
    const skills = bulkSkills
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length > 0) {
      await createSkillsBulk(skills);
      setBulkSkills("");
    }
    setIsSubmitting(false);
  };

  return (
    <Tabs defaultValue="single" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single">Single</TabsTrigger>
        <TabsTrigger value="bulk">Bulk</TabsTrigger>
      </TabsList>

      <TabsContent value="single">
        <form onSubmit={handleSingleSubmit} className="flex gap-3 items-center">
          <Input
            placeholder="Add a skill (e.g., React)"
            value={singleSkill}
            onChange={(e) => setSingleSkill(e.target.value)}
            className="flex-grow"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !singleSkill.trim()}>
            Add
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="bulk">
        <form onSubmit={handleBulkSubmit} className="flex flex-col gap-3">
          <Textarea
            placeholder="Add multiple skills separated by commas or new lines:&#10;React, TypeScript, Node.js&#10;or&#10;React&#10;TypeScript&#10;Node.js"
            value={bulkSkills}
            onChange={(e) => setBulkSkills(e.target.value)}
            rows={4}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={isSubmitting || !bulkSkills.trim()}
            className="w-fit"
          >
            Add All
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default SkillForm;
