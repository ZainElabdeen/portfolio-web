import prisma from "@/prisma/client";
import ExperienceTable from "./experience-table";

const ExperiencePage = async () => {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: "desc" },
  });

  return <ExperienceTable experiences={experiences} />;
};

export default ExperiencePage;
