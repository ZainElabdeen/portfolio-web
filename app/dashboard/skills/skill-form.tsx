"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { skillSchema, TSkill } from "@/lib/validation";
import { createSkill } from "@/actions/skill.action";

const SkillForm = () => {
  const form = useForm<TSkill>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: TSkill) {
    await createSkill(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-3 items-center w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input
                  placeholder="Add a skill"
                  className="min-w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark"
        >
          Add
        </Button>
      </form>
    </Form>
  );
};

export default SkillForm;
