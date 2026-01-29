import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

const experiencesData = [
  {
    title: "Full Stack Developer at Sphere IT",
    location: "Dubai, United Arab Emirates",
    description:
      "Developed dynamic dashboards and backend systems for ride-sharing platforms. Utilized React, Apollo GraphQL, NestJS, and PostgreSQL to deliver high-performance and scalable solutions.",
    icon: "FaReact",
    startDate: new Date("2022-03-01"),
    endDate: new Date("2024-10-01"),
  },
  {
    title: "Full Stack Engineer at Musafer Information Technology Co. Ltd.",
    location: "Khartoum, Sudan",
    description:
      "Designed a customer-facing dashboard with React SPA, state management via Redux, and internationalization support. Developed a scalable server-side application using NestJS and GraphQL.",
    icon: "FaReact",
    startDate: new Date("2019-10-01"),
    endDate: new Date("2022-03-01"),
  },
  {
    title: "Full Stack Developer at Nano Technology Co. Ltd.",
    location: "Khartoum, Sudan",
    description:
      "Built and maintained responsive dashboards using React, Redux, and Semantic UI. Developed scalable RESTful APIs with Node.js and Express.js, integrating real-time communication with Socket.io.",
    icon: "FaReact",
    startDate: new Date("2018-04-01"),
    endDate: new Date("2019-10-01"),
  },
  {
    title: "System Administrator",
    location: "University Of Gezira, WadMedani, Sudan",
    description:
      "Managed servers (Web, DNS, Zimbra Mail, Bacula Backup) and firewalls, including FreeBSD and CentOS environments.",
    icon: "CgWorkAlt",
    startDate: new Date("2017-03-01"),
    endDate: new Date("2018-04-01"),
  },
  {
    title: "Teaching Assistant",
    location: "University Of Gezira, WadMedani, Sudan",
    description:
      "Supported students in courses like Data Communications, Networking, and Image Processing. Designed individual education programs to monitor progress.",
    icon: "CgWorkAlt",
    startDate: new Date("2013-02-01"),
    endDate: new Date("2015-11-01"),
  },
  {
    title: "Graduated from University of Gezira",
    location: "WadMedani, Sudan",
    description:
      "Earned a B.Sc. (Honours) in Computer Engineering Technology, building a strong foundation in engineering and programming.",
    icon: "LuGraduationCap",
    startDate: new Date("2008-09-01"),
    endDate: new Date("2012-12-01"),
  },
];

const projectsData = [
  {
    title: "Zed Admin",
    description:
      "A full-stack admin panel and API for managing Zed, a transportation platform redefining seamless and efficient commutes.",
    tags: [
      "React",
      "Nest.js",
      "PostgreSQL",
      "Material UI",
      "GraphQL",
      "MikroORM",
      "Google Maps",
    ],
    imageUrl: "/zed-admin.png",
  },
  {
    title: "Auto Aid CRM",
    description:
      "An admin panel built with React and TypeScript to manage service requests, connecting vehicle owners with technicians seamlessly.",
    tags: ["React", "TypeScript", "Material UI", "Redux Toolkit"],
    imageUrl: "/autoaid-crm.png",
  },
];

const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "NestJS",
  "Redux",
  "Redux Toolkit",
  "React Query",
  "Apollo",
  "Express",
  "Git",
  "Tailwind",
  "Material UI",
  "Bootstrap",
  "Framer Motion",
  "Figma",
  "Jest",
  "Cypress",
  "Unit Testing",
  "Docker",
  "Kubernetes",
  "kafka",
  "Ansible",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Redis",
  "GraphQL",
  "MikroORM",
  "Nginx",
  "Jira",
  "Agile",
];

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.skill.deleteMany();

  // Seed Projects
  console.log("📦 Seeding projects...");
  for (const project of projectsData) {
    await prisma.project.create({
      data: project,
    });
  }
  console.log(`✅ Created ${projectsData.length} projects`);

  // Seed Experiences
  console.log("💼 Seeding experiences...");
  for (const experience of experiencesData) {
    await prisma.experience.create({
      data: experience,
    });
  }
  console.log(`✅ Created ${experiencesData.length} experiences`);

  // Seed Skills
  console.log("🎯 Seeding skills...");
  for (let i = 0; i < skillsData.length; i++) {
    await prisma.skill.create({
      data: {
        title: skillsData[i],
        order: i + 1,
      },
    });
  }
  console.log(`✅ Created ${skillsData.length} skills`);

  console.log("🌱 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
