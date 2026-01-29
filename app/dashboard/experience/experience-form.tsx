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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { experienceSchema, TExperience } from "@/lib/validation";
import {
  createExperience,
  updateExperience,
} from "@/actions/experience.action";
import { Loader2 } from "lucide-react";

const ICON_OPTIONS = [
  { value: "FaBriefcase", label: "Briefcase" },
  { value: "FaCode", label: "Code" },
  { value: "FaReact", label: "React" },
  { value: "FaNodeJs", label: "Node.js" },
  { value: "FaDatabase", label: "Database" },
  { value: "FaServer", label: "Server" },
];

const LOCATION_TYPES = ["Remote", "Onsite", "Hybrid"] as const;
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
  "Freelance",
] as const;

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
      companyName: "",
      location: "",
      locationType: undefined,
      employmentType: undefined,
      description: "",
      startDate: "",
      endDate: "",
      current: false,
      icon: "",
      companyLogoUrl: "",
    },
  });

  const currentJob = form.watch("current");

  useEffect(() => {
    if (editExperience) {
      form.reset({
        title: editExperience.title,
        companyName: editExperience.companyName || "",
        location: editExperience.location || "",
        locationType: editExperience.locationType,
        employmentType: editExperience.employmentType,
        description: editExperience.description,
        startDate: editExperience.startDate,
        endDate: editExperience.endDate || "",
        current: editExperience.current || false,
        icon: editExperience.icon || "",
        companyLogoUrl: editExperience.companyLogoUrl || "",
      });
    } else {
      form.reset({
        title: "",
        companyName: "",
        location: "",
        locationType: undefined,
        employmentType: undefined,
        description: "",
        startDate: "",
        endDate: "",
        current: false,
        icon: "",
        companyLogoUrl: "",
      });
    }
  }, [editExperience, form]);

  async function onSubmit(values: TExperience) {
    setIsSubmitting(true);
    // Clear end date if current job is checked
    const submitValues = {
      ...values,
      endDate: values.current ? undefined : values.endDate,
    };

    if (isEditing && editExperience) {
      const result = await updateExperience(editExperience.id, submitValues);
      if (result.success) {
        form.reset();
        onCancelEdit?.();
      }
    } else {
      const result = await createExperience(submitValues);
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
                <FormLabel>Job Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Company Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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

          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LOCATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

        <div className="grid gap-4 md:grid-cols-4">
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
                  <Input type="date" {...field} disabled={currentJob} />
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
                <FormLabel className="font-normal">Current Job</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
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

        <FormField
          control={form.control}
          name="companyLogoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Logo</FormLabel>
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
