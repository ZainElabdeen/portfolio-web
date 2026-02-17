"use client";

import { motion } from "framer-motion";

import SectionHeading from "./section-heading";
import { useSectionInView } from "@/hooks/use-sectionIn-view";
import { RichTextViewer } from "@/components/ui/rich-text-viewer";

interface Profile {
  aboutText?: string | null;
}

interface AboutProps {
  profile: Profile | null;
}

const About = ({ profile }: AboutProps) => {
  const { ref } = useSectionInView("About");

  const aboutText = profile?.aboutText;

  // Default content if no profile aboutText exists
  const defaultContent = `
    <p class="mb-3">
      Welcome to my portfolio! I am a passionate developer dedicated to creating
      amazing digital experiences. Update your profile in the dashboard to customize
      this section with your own story.
    </p>
  `;

  return (
    <motion.section
      className="mb-28 max-w-[48rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
      ref={ref}
    >
      <SectionHeading>About Me</SectionHeading>
      <RichTextViewer
        content={aboutText || defaultContent}
        className="text-center"
      />
    </motion.section>
  );
};

export default About;
