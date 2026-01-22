import React from "react";
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

import prisma from "@/prisma/client";
import DynamicIcon from "@/components/DynamicIcon";
// import FormDialog from "@/components/FormDialog";

const ExperiencePage = async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return (
    <Table>
      <TableCaption>A list of my Experiences.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiences.map((experience) => (
          <TableRow key={experience.id}>
            <TableCell>
              <DynamicIcon name={experience?.icon ?? undefined} />
            </TableCell>
            <TableCell className="font-medium">{experience.title}</TableCell>
            <TableCell>{experience.location}</TableCell>
            <TableCell>{experience.description}</TableCell>
            <TableCell>
              {format(new Date(experience.startDate), "dd/MM/yyyy")}
            </TableCell>
            <TableCell>
              {format(new Date(experience.endDate), "dd/MM/yyyy")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* <FormDialog open={true} header={""}>
        <div></div>
      </FormDialog> */}
    </Table>
  );
};

export default ExperiencePage;
