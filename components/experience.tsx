"use client";

import React from "react";
import { motion } from "framer-motion";

import SectionHeading from "./section-heading";
import { experiencesData } from "@/lib/data";
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

const Experience = () => {
  const { ref } = useSectionInView("Experience", 0.5);

  return (
    <section
      id="experience"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 max-w-[72rem] "
    >
      <SectionHeading>My experience</SectionHeading>

      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {experiencesData.map((item, index) => (
          <React.Fragment key={index}>
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
              {/* Icon */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white dark:bg-gray-700 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="text-2xl text-gray-500 dark:text-white/75">
                  {item.icon}
                </div>
              </div>

              {/* Card */}
              <div className="flex flex-col w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow text-gray-700 dark:text-white/80">
                <div className="flex items-start justify-between space-x-2 mb-1">
                  <div>
                    <h3 className="font-semibold capitalize">{item.title}</h3>
                    <p className="font-normal">{item.location}</p>
                  </div>

                  <time className="hidden md:block text-sm font-sm font-semibold">
                    {item.date}
                  </time>
                </div>
                <p>{item.description}</p>
                <time className="block md:hidden font-medium text-xs my-2">
                  {item.date}
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
