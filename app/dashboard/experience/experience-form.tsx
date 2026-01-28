"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { experienceSchema, TExperience } from "@/lib/validation";
import {
  createExperience,
  updateExperience,
} from "@/actions/experience.action";
import { Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "LuGraduationCap", label: "Graduation Cap" },
  { value: "CgWorkAlt", label: "Work" },
  { value: "FaReact", label: "React" },
  { value: "SiNextdotjs", label: "Next.js" },
  { value: "FaNodeJs", label: "Node.js" },
  { value: "SiTypescript", label: "TypeScript" },
];

export interface ExperienceData extends TExperience {
  id: string;
}

interface ExperienceFormProps {
  editExperience?: ExperienceData | null;
  onCancelEdit?: () => void;
}

const ExperienceForm = ({
  editExperience,
  onCancelEdit,
}: ExperienceFormProps) => {
  const isEditing = !!editExperience;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TExperience>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      startDate: "",
      endDate: "",
      icon: "",
    },
  });

  useEffect(() => {
    if (editExperience) {
      form.reset({
        title: editExperience.title,
        location: editExperience.location,
        description: editExperience.description,
        startDate: editExperience.startDate,
        endDate: editExperience.endDate,
        icon: editExperience.icon || "",
      });
    } else {
      form.reset({
        title: "",
        location: "",
        description: "",
        startDate: "",
        endDate: "",
        icon: "",
      });
    }
  }, [editExperience, form]);

  async function onSubmit(values: TExperience) {
    setIsSubmitting(true);
    if (isEditing && editExperience) {
      const result = await updateExperience(editExperience.id, values);
      if (result.success) {
        form.reset();
        onCancelEdit?.();
      }
    } else {
      const result = await createExperience(values);
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
            {isEditing ? "Edit Experience" : "Add New Experience"}
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="New York, NY" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your role and responsibilities..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ICON_OPTIONS.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-fit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : isEditing ? (
            "Update Experience"
          ) : (
            "Add Experience"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ExperienceForm;
