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
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
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

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <ProjectForm
        editProject={editingProject}
        onCancelEdit={handleCancelEdit}
      />

      <Table>
        <TableCaption>A list of your recent Projects.</TableCaption>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
