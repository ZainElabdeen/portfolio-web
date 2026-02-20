import { PrismaClient } from "../prisma/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await prisma.resume.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.profile.deleteMany();

  // ── Profile ────────────────────────────────────────────────────────────────
  console.log("👤 Creating profile...");
  await prisma.profile.create({
    data: {
      fullName: "Zainelabdeen S.A Elgraeed",
      email: "zainco30@gmail.com",
      phone: "+971506412685",
      location: "Abu Dhabi, UAE",
      title: "Sr Full Stack Engineer",
      yearsOfExp: 8,
      summary:
        '<p><span style="font-size: 1.25rem;">I am a seasoned <strong>Full Stack Developer</strong>with over 5 years of experience in front-end and back-end development. I specialize in creating dynamic web applications using modern frameworks like <strong>React, NestJS, and GraphQL</strong>. My expertise also extends to technologies such as Docker and Kubernetes.</span></p><p><span style="font-size: 1.25rem;">I have a passion for <strong>problem-solving</strong>and love the challenge of finding efficient solutions to complex problems. I am proficient in state management, UI libraries like<strong> Material-UI</strong>, and performance optimization. Collaboration is key for me, and I work closely with designers and other developers to deliver seamless user experiences.</span></p><p><span style="font-size: 1.25rem;">I hold a </span><a target="_blank" rel="noopener noreferrer nofollow" href="http://B.Sc"><span style="font-size: 1.25rem;"><strong><u>B.Sc</u></strong></span></a><span style="font-size: 1.25rem;">. (Honours) in Computer Engineering from the<strong> University of Gezira</strong>. My career journey has taken me from being a <strong>Teaching Assistant</strong> to a <strong>System Administrator</strong>, and now to a Full Stack Developer, honing skills in diverse environments.</span></p><p><span style="font-size: 1.25rem;"><em>Outside of coding</em>, I enjoy staying current with new technologies, playing football, and exploring the world of <strong>DevOps</strong>. I\'m always eager to learn and recently completed certifications in <strong>Mobile App Development, Node.js Unit Testing</strong>, and more. I am currently open to new opportunities and looking for challenging projects where I can make a difference.</span></p>',
      introText:
        '<h2><span style="font-size: 1.875rem;"><strong>Hello, I\'m Zainelabdeen. I\'m a Full Stack Engineer with over 8 years of experience. I specialize in <em>React.js, Node.js</em>, and modern backend technologies such as <u>NestJS</u> and <u>GraphQL</u>. Passionate about building user-friendly interfaces, clean code, and effective collaboration. I hold a </strong></span><a target="_blank" rel="noopener noreferrer nofollow" href="http://B.Sc"><span style="font-size: 1.875rem;"><strong><u>B.Sc</u></strong></span></a><span style="font-size: 1.875rem;"><strong><u>. in Computer Engineering</u> from the <u>University of Gezira</u>.</strong></span></h2><p></p>',
      aboutText:
        '<p><span style="font-size: 1.25rem;">I am a seasoned <strong>Full Stack Developer</strong>with over 5 years of experience in front-end and back-end development. I specialize in creating dynamic web applications using modern frameworks like <strong>React, NestJS, and GraphQL</strong>. My expertise also extends to technologies such as Docker and Kubernetes.</span></p><p><span style="font-size: 1.25rem;">I have a passion for <strong>problem-solving</strong>and love the challenge of finding efficient solutions to complex problems. I am proficient in state management, UI libraries like<strong> Material-UI</strong>, and performance optimization. Collaboration is key for me, and I work closely with designers and other developers to deliver seamless user experiences.</span></p><p><span style="font-size: 1.25rem;">I hold a </span><a target="_blank" rel="noopener noreferrer nofollow" href="http://B.Sc"><span style="font-size: 1.25rem;"><strong><u>B.Sc</u></strong></span></a><span style="font-size: 1.25rem;">. (Honours) in Computer Engineering from the<strong> University of Gezira</strong>. My career journey has taken me from being a <strong>Teaching Assistant</strong> to a <strong>System Administrator</strong>, and now to a Full Stack Developer, honing skills in diverse environments.</span></p><p><span style="font-size: 1.25rem;"><em>Outside of coding</em>, I enjoy staying current with new technologies, playing football, and exploring the world of <strong>DevOps</strong>. I\'m always eager to learn and recently completed certifications in <strong>Mobile App Development, Node.js Unit Testing</strong>, and more. I am currently open to new opportunities and looking for challenging projects where I can make a difference.</span></p>',
      profileImageUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769700777885-wh15q8.jpeg",
      cvUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/Zainelabdeen_Salah_CV.pdf",
      linkedinUrl: "https://www.linkedin.com/in/zainelabdeen-salah/",
      githubUrl: "https://github.com/ZainElabdeen",
    },
  });
  console.log("✅ Profile created");

  // ── Projects ───────────────────────────────────────────────────────────────
  console.log("📦 Seeding projects...");
  const projects = [
    {
      title: "Portfolio & Resume Builder",
      description:
        "<p>A self-hosted portfolio and AI-powered resume builder. Manage your profile, projects, and experiences, create tailored resumes, and evaluate job fit with AI.</p>",
      tags: [
        "Next.js",
        "React",
        "TypeScript",
        "MongoDB",
        "Prisma",
        "Tailwind CSS",
        "shadcn/ui",
        "Clerk",
        "Supabase",
        "Vercel AI SDK",
        "Tiptap",
        "Framer Motion",
        "Zod",
      ],
      imageUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1771618009299-96eqd0.png",
      liveUrl: "https://zainelabdeen.vercel.app",
      githubUrl: "https://github.com/ZainElabdeen/portfolio-web",
      order: 0,
    },
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
      order: 0,
    },
    {
      title: "Auto Aid CRM",
      description:
        "An admin panel built with React and TypeScript to manage service requests, connecting vehicle owners with technicians seamlessly.",
      tags: ["React", "TypeScript", "Material UI", "Redux Toolkit"],
      imageUrl: "/autoaid-crm.png",
      order: 0,
    },
  ];
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ Created ${projects.length} projects`);

  // ── Experiences ────────────────────────────────────────────────────────────
  console.log("💼 Seeding experiences...");
  const experiences = [
    {
      title: "Sr. Full Stack Developer",
      companyName: "Saftaja",
      location: "Riyadh, KSA",
      locationType: "Remote",
      employmentType: "Part-time",
      description:
        '<ul><li><p><span style="font-size: 0.875rem;">Led frontend development of core mobile fintech product using React Native, TypeScript, and modern design systems, delivering high-performance cross-platform applications with responsive UI implementation.</span></p></li><li><p><span style="font-size: 0.875rem;">Architected and implemented RESTful APIs and backend services using Node.js and NestJS, deployed across Google Cloud and Alibaba Cloud with containerized solutions (Docker/Kubernetes).</span></p></li></ul><ul><li><p><span style="font-size: 0.875rem;">Contributed to real-time AML (Anti-Money Laundering) processing system using streaming data technologies (flink, Kafka), supporting regulatory compliance requirements.</span></p></li></ul><ul><li><p><span style="font-size: 0.875rem;">Collaborated with cross-functional teams and designers to deliver modern, accessible UI using Tailwind CSS, maintaining WCAG compliance and design system standards.</span></p></li></ul><p></p>',
      icon: "FaCode",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769682515267-qapcaa.png",
      startDate: new Date("2024-01-10"),
      current: true,
      order: 0,
    },
    {
      title: "Full Stack Developer",
      companyName: "Sphere IT",
      location: "Dubai, United Arab Emirates",
      locationType: "Onsite",
      employmentType: "Full-time",
      description:
        "<ul><li><p>Engineered enterprise-grade web dashboard using React.js, TypeScript, and Apollo GraphQL for efficient customer data management, with responsive design implementation and Material UI components.</p></li><li><p>Implemented advanced features including geographic area definition with polylines, real-time notification services, and integrated Google Maps API for location-based functionality.</p></li><li><p>Integrated CASL (authorization library) to provide secure, role-based access control, ensuring precise authorization for different user roles across the application.</p></li><li><p>Architected scalable backend infrastructure for taxi ride-sharing platform using NestJS, implementing real-time geolocation services, Redis caching, and PostgreSQL database with MikroORM.</p></li><li><p>Optimized application performance through efficient state management strategies, implementing caching mechanisms and responsive design patterns for enhanced user experience.</p></li></ul><p></p>",
      icon: "FaReact",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769682315113-etk8vn.jpeg",
      startDate: new Date("2022-03-01"),
      endDate: new Date("2024-10-01"),
      current: false,
      order: 0,
    },
    {
      title: "Full Stack Engineer",
      companyName: "Musafer Information Technology Co. Ltd.",
      location: "Khartoum, Sudan",
      locationType: "Onsite",
      employmentType: "Full-time",
      description:
        "<ul><li><p>Designed and developed customer-facing dashboard using React SPA architecture with Redux and Redux-Saga for efficient state management and asynchronous side-effect handling.</p></li><li><p>Implemented Apollo Client for GraphQL state management and intelligent caching, optimizing data fetching strategies and synchronization across application components.</p></li><li><p>Built responsive UI components following modern design principles, ensuring cross-browser compatibility and optimal user experience across devices.</p></li><li><p>Contributed to backend API development and integration, collaborating with backend team to ensure seamless frontend-backend communication.</p></li><li><p>Architected and deployed a complete, highly available, on-premise container orchestration system using Kubernetes managed via KubeSpray. Successfully validated the system's resilience and scalability for production services within the Dev/Test environment.</p></li></ul><p></p>",
      icon: "FaReact",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769682900855-qixi7n.jpeg",
      startDate: new Date("2019-10-01"),
      endDate: new Date("2022-03-01"),
      current: false,
      order: 0,
    },
    {
      title: "Full Stack Developer",
      companyName: "Nano Technology Co. Ltd.",
      location: "Khartoum, Sudan",
      locationType: "Onsite",
      employmentType: "Full-time",
      description:
        '<ul><li><p>Developed and maintained responsive dashboards using React, Redux, Redux-Saga, React Router, Formik, and Semantic UI React, demonstrating proficiency in modern React ecosystem.</p></li><li><p>Implemented Redux state management architecture for complex application workflows, ensuring smooth data flow and efficient handling of side effects.</p></li><li><p>Built scalable RESTful APIs using Node.js, Express.js, and Sequelize.js with real-time features via <a target="_blank" rel="noopener noreferrer nofollow" href="http://Socket.io"><strong><u>Socket.io</u></strong></a>, supporting dynamic dashboard functionality</p></li></ul><p></p>',
      icon: "FaReact",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769683348753-ifp1o1.jpeg",
      startDate: new Date("2018-04-01"),
      endDate: new Date("2019-10-01"),
      current: false,
      order: 0,
    },
    {
      title: "System Administrator",
      companyName: "University Of Gezira",
      location: "WadMedani, Sudan",
      locationType: "Onsite",
      employmentType: "Full-time",
      description:
        "<p>Managed servers (Web, DNS, Zimbra Mail, Bacula Backup) and firewalls, including FreeBSD and CentOS environments.</p>",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769682607829-hzvzde.jpeg",
      startDate: new Date("2017-03-01"),
      endDate: new Date("2018-04-01"),
      current: false,
      order: 0,
    },
    {
      title: "Teaching Assistant",
      companyName: "University Of Gezira",
      location: "WadMedani, Sudan",
      locationType: "Onsite",
      employmentType: "Part-time",
      description:
        "<p>Supported students in courses like Data Communications, Networking, and Image Processing. Designed individual education programs to monitor progress.</p>",
      companyLogoUrl:
        "https://qixhipnwgtzpjfukcpwc.supabase.co/storage/v1/object/public/portfolio-images/1769682607829-hzvzde.jpeg",
      startDate: new Date("2013-02-01"),
      endDate: new Date("2015-11-01"),
      current: false,
      order: 0,
    },
  ];
  for (const experience of experiences) {
    await prisma.experience.create({ data: experience });
  }
  console.log(`✅ Created ${experiences.length} experiences`);

  // ── Education ──────────────────────────────────────────────────────────────
  console.log("🎓 Seeding education...");
  await prisma.education.create({
    data: {
      institution: "University Of Gezira",
      degree: "B.S.c. in Computer Engineering Technology",
      startDate: new Date("2007-12-12"),
      endDate: new Date("2012-12-12"),
      current: false,
      order: 0,
    },
  });
  console.log("✅ Created 1 education record");

  // ── Skills ─────────────────────────────────────────────────────────────────
  console.log("🎯 Seeding skills...");
  const skills = [
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
  ];
  for (let i = 0; i < skills.length; i++) {
    await prisma.skill.create({ data: { title: skills[i], order: i + 1 } });
  }
  console.log(`✅ Created ${skills.length} skills`);

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
