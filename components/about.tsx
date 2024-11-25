"use client";

/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";

import SectionHeading from "./section-heading";
import { useSectionInView } from "@/hooks/use-sectionIn-view";

const About = () => {
  const { ref } = useSectionInView("About");
  return (
    <motion.section
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
      ref={ref}
    >
      <SectionHeading>About Me</SectionHeading>
      <p className="mb-3">
        I am a seasoned{" "}
        <span className="font-medium">Full Stack Developer</span>
        with over 5 years of experience in front-end and back-end development. I
        specialize in creating dynamic web applications using modern frameworks
        like <span className="font-medium">React, NestJS, and GraphQL</span>. My
        expertise also extends to technologies such as Docker, Kubernetes, and
        AWS.
      </p>

      <p className="mb-3">
        I have a passion for{" "}
        <span className="font-medium">problem-solving</span>
        and love the challenge of finding efficient solutions to complex
        problems. I am proficient in state management, UI libraries like
        <span className="font-medium"> Material-UI</span>, and performance
        optimization. Collaboration is key for me, and I work closely with
        designers and other developers to deliver seamless user experiences.
      </p>

      <p className="mb-3">
        I hold a B.Sc. (Honours) in Computer Engineering from the
        <span className="font-medium"> University of Gezira</span>. My career
        journey has taken me from being a{" "}
        <span className="font-medium">Teaching Assistant</span>
        to a <span className="font-medium">System Administrator</span>, and now
        to a Full Stack Developer, honing skills in diverse environments.
      </p>

      <p>
        <span className="italic">Outside of coding</span>, I enjoy staying
        current with new technologies, playing video games, and exploring the
        world of
        <span className="font-medium"> network security</span>. I'm always eager
        to learn and recently completed certifications in{" "}
        <span className="font-medium">
          Mobile App Development, Node.js Unit Testing
        </span>
        , and more. I am currently open to new opportunities and looking for
        challenging projects where I can make a difference.
      </p>
    </motion.section>
  );
};

export default About;
