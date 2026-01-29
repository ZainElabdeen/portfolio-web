"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";

import SectionHeading from "./section-heading";
import DynamicIcon from "./DynamicIcon";
import { useSectionInView } from "@/hooks/use-sectionIn-view";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * index,
    },
  }),
};

interface ExperienceItem {
  id: string;
  title: string;
  companyName: string | null;
  location: string | null;
  locationType: string | null;
  employmentType: string | null;
  description: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  icon: string | null;
  companyLogoUrl: string | null;
}

interface ExperienceProps {
  experiences: ExperienceItem[];
}

const Experience = ({ experiences }: ExperienceProps) => {
  const { ref } = useSectionInView("Experience", 0.5);

  const formatDateRange = (
    startDate: Date,
    endDate: Date | null,
    current: boolean
  ) => {
    const start = format(new Date(startDate), "MMM yyyy");
    if (current) return `${start} - Present`;
    if (!endDate) return start;
    return `${start} - ${format(new Date(endDate), "MMM yyyy")}`;
  };

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 max-w-6xl"
    >
      <SectionHeading>My experience</SectionHeading>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {experiences.map((item, index) => (
          <React.Fragment key={item.id}>
            <motion.div
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              variants={fadeInAnimationVariants}
              initial="initial"
              whileInView="animate"
              viewport={{
                once: true,
              }}
              custom={index}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 overflow-hidden">
                {item.companyLogoUrl ? (
                  <Image
                    src={item.companyLogoUrl}
                    alt={item.companyName || "Company logo"}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <DynamicIcon
                    name={item.icon ?? undefined}
                    className="text-xl"
                  />
                )}
              </div>

              <div className="flex flex-col w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 dark:border-slate-700 shadow dark:bg-gray-800/50">
                <div className="flex items-start justify-between space-x-2 mb-1">
                  <div>
                    <h3 className="font-semibold capitalize">{item.title}</h3>
                    <p className="font-normal text-muted-foreground">
                      {item.companyName}
                      {item.companyName && item.location && " · "}
                      {item.location}
                      {item.locationType && ` (${item.locationType})`}
                    </p>
                    {item.employmentType && (
                      <span className="text-xs text-muted-foreground">
                        {item.employmentType}
                      </span>
                    )}
                  </div>
                  {item.current && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {item.description}
                </p>

                <time className="block md:hidden font-medium text-xs mt-3 text-muted-foreground">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </time>
              </div>

              <div className="order-1 hidden md:block text-sm font-semibold px-8">
                <time className="text-muted-foreground">
                  {formatDateRange(item.startDate, item.endDate, item.current)}
                </time>
              </div>
            </motion.div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Experience;
