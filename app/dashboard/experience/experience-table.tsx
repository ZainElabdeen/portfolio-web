"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Briefcase, Loader2 } from "lucide-react";
import DynamicIcon from "@/components/DynamicIcon";
import ExperienceForm, { ExperienceData } from "./experience-form";
import { deleteExperience } from "@/actions/experience.action";

interface Experience {
  id: string;
  title: string;
  companyName: string | null;
  location: string | null;
  locationType: string | null;
  employmentType: string | null;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  icon: string | null;
  companyLogoUrl: string | null;
}

interface ExperienceTableProps {
  experiences: Experience[];
}

export default function ExperienceTable({ experiences }: ExperienceTableProps) {
  const [editingExperience, setEditingExperience] =
    useState<ExperienceData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (experience: Experience) => {
    setEditingExperience({
      id: experience.id,
      title: experience.title,
      companyName: experience.companyName || undefined,
      location: experience.location || undefined,
      locationType: experience.locationType as
        | "Remote"
        | "Onsite"
        | "Hybrid"
        | undefined,
      employmentType: experience.employmentType as
        | "Full-time"
        | "Part-time"
        | "Contract"
        | "Intern"
        | "Freelance"
        | undefined,
      description: experience.description,
      startDate: format(new Date(experience.startDate), "yyyy-MM-dd"),
      endDate: experience.endDate
        ? format(new Date(experience.endDate), "yyyy-MM-dd")
        : undefined,
      current: experience.current,
      icon: experience.icon || undefined,
      companyLogoUrl: experience.companyLogoUrl || undefined,
    });
  };

  const handleCancelEdit = () => {
    setEditingExperience(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteExperience(id);
    setDeletingId(null);
  };

  const formatPeriod = (
    startDate: Date,
    endDate: Date | null,
    current: boolean
  ) => {
    const start = format(new Date(startDate), "MMM yyyy");
    if (current) return `${start} - Present`;
    if (!endDate) return start;
    return `${start} - ${format(new Date(endDate), "MMM yyyy")}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
        <p className="text-muted-foreground">
          Manage your work history and professional experience.
        </p>
      </div>

      <ExperienceForm
        editExperience={editingExperience}
        onCancelEdit={handleCancelEdit}
      />

      {experiences.length > 0 ? (
        <Table>
          <TableCaption>A list of your experiences.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Icon</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <DynamicIcon
                      name={experience.icon ?? undefined}
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{experience.title}</span>
                    {experience.companyName && (
                      <span className="text-sm text-muted-foreground">
                        {experience.companyName}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {experience.location && (
                      <span className="text-sm">{experience.location}</span>
                    )}
                    {experience.locationType && (
                      <Badge variant="outline" className="w-fit text-xs">
                        {experience.locationType}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {experience.employmentType && (
                    <Badge variant="secondary">{experience.employmentType}</Badge>
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>
                      {formatPeriod(
                        experience.startDate,
                        experience.endDate,
                        experience.current
                      )}
                    </span>
                    {experience.current && (
                      <Badge className="w-fit mt-1" variant="default">
                        Current
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {experience.title}
                            {experience.companyName
                              ? ` at ${experience.companyName}`
                              : ""}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(experience.id)}
                            disabled={deletingId === experience.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === experience.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              "Delete"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No experience added</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your work history using the form above.
          </p>
        </div>
      )}
    </div>
  );
}
