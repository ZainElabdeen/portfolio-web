"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { BsLinkedin } from "react-icons/bs";
import { FaGithubSquare } from "react-icons/fa";
import { HiDownload } from "react-icons/hi";

import { useSectionInView } from "@/hooks/use-sectionIn-view";
import { RichTextViewer } from "@/components/ui/rich-text-viewer";

interface Profile {
  id: string;
  fullName: string;
  title?: string | null;
  yearsOfExp?: number | null;
  introText?: string | null;
  profileImageUrl?: string | null;
  cvUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
}

interface IntroProps {
  profile: Profile | null;
}

const Intro = ({ profile }: IntroProps) => {
  const { ref } = useSectionInView("Home", 0.5);

  // Fallback values if no profile exists
  const fullName = profile?.fullName || "Your Name";
  const title = profile?.title || "Developer";
  const yearsOfExp = profile?.yearsOfExp || 0;
  const introText = profile?.introText;
  const profileImage = profile?.profileImageUrl || "/me.jpeg";
  const cvUrl = profile?.cvUrl || "/CV.pdf";
  const linkedinUrl = profile?.linkedinUrl || "#";
  const githubUrl = profile?.githubUrl || "#";

  return (
    <section
      className="mb-28 max-w-[48rem] text-center sm:mb-0 scroll-mt-[100rem]"
      ref={ref}
      id="home"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
          >
            <Image
              src={profileImage}
              alt={`${fullName}'s profile picture`}
              width={200}
              height={200}
              className="h-24 w-24 rounded-full object-cover border-[0.35rem] border-white shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-4xl scroll-mt-[100rem]"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        id="home"
      >
        {introText ? (
          <RichTextViewer content={introText} className="text-center" />
        ) : (
          <h1>
            <span className="font-bold">Hello, I&apos;m {fullName}.</span> I&apos;m a{" "}
            <span className="font-bold">{title}</span>
            {yearsOfExp > 0 && (
              <>
                {" "}with over <span className="font-bold">{yearsOfExp} years</span> of experience
              </>
            )}
            .
          </h1>
        )}
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        {cvUrl && (
          <a
            className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
            href={cvUrl}
            download
          >
            Download CV{" "}
            <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
          </a>
        )}

        {linkedinUrl && linkedinUrl !== "#" && (
          <a
            className="bg-white p-4 text-gray-700 hover:text-gray-950 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsLinkedin />
          </a>
        )}

        {githubUrl && githubUrl !== "#" && (
          <a
            className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithubSquare />
          </a>
        )}
      </motion.div>
    </section>
  );
};

export default Intro;
