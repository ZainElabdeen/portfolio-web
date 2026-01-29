import prisma from "@/prisma/client";
import EducationTable from "./education-table";

const EducationPage = async () => {
  const educations = await prisma.education.findMany({
    orderBy: [{ current: "desc" }, { startDate: "desc" }],
  });

  return <EducationTable educations={educations} />;
};

export default EducationPage;
