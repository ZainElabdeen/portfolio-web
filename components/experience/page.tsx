import { TExperience } from "@/lib/validation";
import Experience from "./experience";

const ExperiencePage = async () => {
  const getExperiencesData = async () => {
    const res = await fetch("http://localhost:3000/api/experiences");
    return res.json();
  };

  const experiencesData: TExperience = await getExperiencesData();

  return <Experience experiencesData={experiencesData} />;
};

export default ExperiencePage;
