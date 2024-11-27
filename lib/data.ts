import React from "react";
import { StaticImageData } from "next/image";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

import autoaidImg from "@/public/autoaid-crm.png";
import zedImg from "@/public/zed-admin.png";
// import aljImg from "@/public/alj-micrsite.png";



export interface IProjectItem {
  title: string;
  description: string;
  tags: readonly string[];
  imageUrl: StaticImageData;
}

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  // {
  //   name: "Contact",
  //   hash: "#contact",
  // },
] as const;

export const experiencesData = [
  {
    title: "Full Stack Developer at Sphere IT",
    location: "Dubai, United Arab Emirates",
    description:
      "Developed dynamic dashboards and backend systems for ride-sharing platforms. Utilized React, Apollo GraphQL, NestJS, and PostgreSQL to deliver high-performance and scalable solutions.",
    icon: React.createElement(FaReact),
    date: "March 2022 - October 2024",
  },
  {
    title: "Full Stack Engineer at Musafer Information Technology Co. Ltd.",
    location: "Khartoum, Sudan",
    description:
      "Designed a customer-facing dashboard with React SPA, state management via Redux, and internationalization support. Developed a scalable server-side application using NestJS and GraphQL.",
    icon: React.createElement(FaReact),
    date: "October 2019 - March 2022",
  },
  {
    title: "Full Stack Developer at Nano Technology Co. Ltd.",
    location: "Khartoum, Sudan",
    description:
      "Built and maintained responsive dashboards using React, Redux, and Semantic UI. Developed scalable RESTful APIs with Node.js and Express.js, integrating real-time communication with Socket.io.",
    icon: React.createElement(FaReact),
    date: "April 2018 - October 2019",
  },
  {
    title: "System Administrator",
    location: "University Of Gezira, WadMedani, Sudan",
    description:
      "Managed servers (Web, DNS, Zimbra Mail, Bacula Backup) and firewalls, including FreeBSD and CentOS environments.",
    icon: React.createElement(CgWorkAlt),
    date: "March 2017 - April 2018",
  },
  {
    title: "Teaching Assistant",
    location: "University Of Gezira, WadMedani, Sudan",
    description:
      "Supported students in courses like Data Communications, Networking, and Image Processing. Designed individual education programs to monitor progress.",
    icon: React.createElement(CgWorkAlt),
    date: "February 2013 - November 2015",
  },
  {
    title: "Graduated from University of Gezira",
    location: "WadMedani, Sudan",
    description:
      "Earned a B.Sc. (Honours) in Computer Engineering Technology, building a strong foundation in engineering and programming.",
    icon: React.createElement(LuGraduationCap),
    date: "December 2012",
  },
] as const;

export const projectsData : readonly IProjectItem[]  = [
  {
    title: "Zed Admin",
    description: "A full-stack admin panel and API for managing Zed, a transportation platform redefining seamless and efficient commutes.",
    tags: ["React", "Nest.js", "PostgreSQL", "Material UI", "GraphQL", "MikroORM", "Google Maps"],
    imageUrl: zedImg,
  },
  {
      title: "Auto Aid CRM",
      description: "An admin panel built with React and TypeScript to manage service requests, connecting vehicle owners with technicians seamlessly.",
      tags: ["React", "TypeScript", "Material UI", "Redux Toolkit"],
      imageUrl: autoaidImg,
  },
  // {
  //   title: "ALJ Microsite",
  //   description: "",
  //   tags: ["React", "TypeScript", "Material UI", "React Query"],
  //   imageUrl: aljImg,
  // },
] as const;

export const skillsData = [
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
] as const;