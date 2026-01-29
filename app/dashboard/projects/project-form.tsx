"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { projectSchema, TProject } from "@/lib/validation";
import { createProject, updateProject } from "@/actions/project.action";

interface TagsInputProps {
  initialValue: string;
  onChange: (tags: string[]) => void;
}

const TagsInput = ({ initialValue, onChange }: TagsInputProps) => {
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <Input
      placeholder="React, TypeScript, Next.js"
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      onBlur={() => {
        const tags = inputValue
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
        onChange(tags);
      }}
    />
  );
};

export interface ProjectData extends TProject {
  id: string;
}

interface ProjectFormProps {
  editProject?: ProjectData | null;
  onCancelEdit?: () => void;
}

const ProjectForm = ({ editProject, onCancelEdit }: ProjectFormProps) => {
  const isEditing = !!editProject;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TProject>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
    },
  });

  useEffect(() => {
    if (editProject) {
      form.reset({
        title: editProject.title,
        description: editProject.description,
        tags: editProject.tags,
        imageUrl: editProject.imageUrl || "",
        liveUrl: editProject.liveUrl || "",
        githubUrl: editProject.githubUrl || "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        tags: [],
        imageUrl: "",
        liveUrl: "",
        githubUrl: "",
      });
    }
  }, [editProject, form]);

  async function onSubmit(values: TProject) {
    setIsSubmitting(true);
    if (isEditing && editProject) {
      const result = await updateProject(editProject.id, values);
      if (result.success) {
        form.reset();
        onCancelEdit?.();
      }
    } else {
      const result = await createProject(values);
      if (result.success) {
        form.reset();
      }
    }
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 border rounded-lg bg-card"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit Project" : "Add New Project"}
          </h3>
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Project title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl>
                  <TagsInput
                    key={editProject?.id || "new"}
                    initialValue={
                      editProject?.tags?.join(", ") ||
                      field.value?.join(", ") ||
                      ""
                    }
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Project description..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="liveUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  onRemove={() => field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Update Project"
          ) : (
            "Add Project"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProjectForm;
