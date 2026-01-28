import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Briefcase } from "lucide-react";

import prisma from "@/prisma/client";
import DynamicIcon from "@/components/DynamicIcon";

const ExperiencePage = async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground">
            Manage your work history and professional experience.
          </p>
        </div>
      </div>

      {experiences.length > 0 ? (
        <Table>
          <TableCaption>A list of your experiences.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="max-w-xs">Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell>
                  <DynamicIcon name={experience?.icon ?? undefined} />
                </TableCell>
                <TableCell className="font-medium">
                  {experience.title}
                </TableCell>
                <TableCell>{experience.location}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {experience.description}
                </TableCell>
                <TableCell>
                  {format(new Date(experience.startDate), "MMM yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(experience.endDate), "MMM yyyy")}
                </TableCell>
                <TableCell></TableCell>
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
            Add your work history to showcase your professional journey.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
