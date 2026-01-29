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
import { Pencil, Trash2, GraduationCap, Loader2 } from "lucide-react";
import EducationForm, { EducationData } from "./education-form";
import { deleteEducation } from "@/actions/education.action";

interface Education {
  id: string;
  institution: string;
  degree: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
}

interface EducationTableProps {
  educations: Education[];
}

export default function EducationTable({ educations }: EducationTableProps) {
  const [editingEducation, setEditingEducation] =
    useState<EducationData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (education: Education) => {
    setEditingEducation({
      id: education.id,
      institution: education.institution,
      degree: education.degree,
      description: education.description || undefined,
      startDate: format(new Date(education.startDate), "yyyy-MM-dd"),
      endDate: education.endDate
        ? format(new Date(education.endDate), "yyyy-MM-dd")
        : undefined,
      current: education.current,
    });
  };

  const handleCancelEdit = () => {
    setEditingEducation(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteEducation(id);
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
        <h2 className="text-3xl font-bold tracking-tight">Education</h2>
        <p className="text-muted-foreground">
          Manage your educational background and qualifications.
        </p>
      </div>

      <EducationForm
        editEducation={editingEducation}
        onCancelEdit={handleCancelEdit}
      />

      {educations.length > 0 ? (
        <Table>
          <TableCaption>A list of your education history.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {educations.map((education) => (
              <TableRow key={education.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{education.institution}</span>
                    {education.description && (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {education.description}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{education.degree}</span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>
                      {formatPeriod(
                        education.startDate,
                        education.endDate,
                        education.current
                      )}
                    </span>
                    {education.current && (
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
                      onClick={() => handleEdit(education)}
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
                          <AlertDialogTitle>Delete Education</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {education.degree} at {education.institution}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(education.id)}
                            disabled={deletingId === education.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === education.id ? (
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
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No education added</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your educational background using the form above.
          </p>
        </div>
      )}
    </div>
  );
}
