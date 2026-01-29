"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { educationSchema, TEducation } from "@/lib/validation";
import { createEducation, updateEducation } from "@/actions/education.action";
import { Loader2 } from "lucide-react";

export interface EducationData extends TEducation {
  id: string;
}

interface EducationFormProps {
  editEducation?: EducationData | null;
  onCancelEdit?: () => void;
}

const EducationForm = ({ editEducation, onCancelEdit }: EducationFormProps) => {
  const isEditing = !!editEducation;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TEducation>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      description: "",
      startDate: "",
      endDate: "",
      current: false,
    },
  });

  const currentStudy = form.watch("current");

  useEffect(() => {
    if (editEducation) {
      form.reset({
        institution: editEducation.institution,
        degree: editEducation.degree,
        description: editEducation.description || "",
        startDate: editEducation.startDate,
        endDate: editEducation.endDate || "",
        current: editEducation.current || false,
      });
    } else {
      form.reset({
        institution: "",
        degree: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      });
    }
  }, [editEducation, form]);

  async function onSubmit(values: TEducation) {
    setIsSubmitting(true);
    const submitValues = {
      ...values,
      endDate: values.current ? undefined : values.endDate,
    };

    if (isEditing && editEducation) {
      const result = await updateEducation(editEducation.id, submitValues);
      if (result.success) {
        form.reset();
        onCancelEdit?.();
      }
    } else {
      const result = await createEducation(submitValues);
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
            {isEditing ? "Edit Education" : "Add New Education"}
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
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution *</FormLabel>
                <FormControl>
                  <Input placeholder="University of..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree *</FormLabel>
                <FormControl>
                  <Input placeholder="B.Sc. in Computer Science" {...field} />
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
                <RichTextEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Describe your studies, achievements, etc..."
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
                <FormLabel>Start Date *</FormLabel>
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
                  <Input type="date" {...field} disabled={currentStudy} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end space-x-2 space-y-0 pb-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Currently Studying</FormLabel>
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
            "Update Education"
          ) : (
            "Add Education"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EducationForm;
