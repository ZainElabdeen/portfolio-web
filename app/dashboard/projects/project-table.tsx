"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";
import { Pencil, Trash2, FolderKanban, Loader2 } from "lucide-react";
import ProjectForm, { ProjectData } from "./project-form";
import { deleteProject } from "@/actions/project.action";

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

interface ProjectTableProps {
  projects: Project[];
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.startsWith("/") ||
    url.startsWith("http://") ||
    url.startsWith("https://")
  );
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [editingProject, setEditingProject] = useState<ProjectData | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteProject(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">
          Manage your portfolio projects and showcase your work.
        </p>
      </div>

      <ProjectForm
        editProject={editingProject}
        onCancelEdit={handleCancelEdit}
      />

      {projects.length > 0 ? (
        <Table>
          <TableCaption>A list of your projects.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  {isValidImageUrl(project.imageUrl) ? (
                    <div className="relative w-16 h-12 rounded overflow-hidden">
                      <Image
                        src={project.imageUrl}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {project.imageUrl || "No image"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {project.description}
                </TableCell>
                <TableCell>
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="mx-1">
                      {tag}
                    </Badge>
                  ))}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(project)}
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
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{project.title}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {deletingId === project.id ? (
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
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your first project using the form above.
          </p>
        </div>
      )}
    </div>
  );
}
