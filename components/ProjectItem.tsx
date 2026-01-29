"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

import type { StaticImageData } from "next/image";

// Enhanced type for ProjectItem props
export interface ProjectItemProps {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string | StaticImageData | null;
  alt?: string; // Optional alt text for accessibility
  link?: string; // Optional link to project
  className?: string; // Optional custom className
}

const ProjectItem = ({
  title,
  description,
  tags,
  imageUrl,
  alt = "Project I worked on",
  link,
  className,
}: ProjectItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  // Helper to handle image source safely (DB URLs or StaticImageData)
  const getImageSrc = (
    src: string | StaticImageData | null,
  ): string | StaticImageData | null => {
    if (!src) return null;
    if (typeof src === "string") {
      return src; // Return DB URL as-is (should be complete URL)
    }
    return src; // StaticImageData
  };

  const safeImageUrl = getImageSrc(imageUrl);

  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <motion.div
      className={
        className
          ? `group mb-3 sm:mb-8 last:mb-0 ${className}`
          : "group mb-3 sm:mb-8 last:mb-0"
      }
      ref={ref}
      style={{
        scale: scaleProgess,
        opacity: opacityProgess,
      }}
      suppressHydrationWarning
    >
      <section className="bg-gray-100 max-w-3xl border border-black/5 rounded-lg overflow-hidden sm:pr-8 relative sm:h-[20rem] hover:bg-gray-200 transition sm:group-even:pl-8 dark:text-white dark:bg-white/10 dark:hover:bg-white/20">
        <div className="pt-4 pb-7 px-5 sm:pl-10 sm:pr-2 sm:pt-10 sm:max-w-[50%] flex flex-col h-full sm:group-even:ml-[18rem]">
          <h3 className="text-2xl font-semibold">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {title}
              </a>
            ) : (
              title
            )}
          </h3>
          <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70">
            {description}
          </p>
          <ul className="flex flex-wrap mt-4 gap-2 sm:mt-auto">
            {tags.map((tag, index) => (
              <li
                className="bg-black/70 px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white rounded-full dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {safeImageUrl && (
          <Image
            src={safeImageUrl}
            alt={alt}
            quality={95}
            width={1200}
            height={1200}
            className="absolute hidden sm:block top-8 -right-40 w-113 rounded-t-lg shadow-2xl
          transition
          group-hover:scale-[1.04]
          group-hover:-translate-x-3
          group-hover:translate-y-3
          group-hover:-rotate-2

          group-even:group-hover:translate-x-3
          group-even:group-hover:translate-y-3
          group-even:group-hover:rotate-2

          group-even:right-[initial] group-even:-left-40"
          />
        )}
      </section>
    </motion.div>
  );
};

export default ProjectItem;
