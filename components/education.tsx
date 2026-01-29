"use client";

import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { GraduationCap, Calendar, MapPin } from "lucide-react";

import SectionHeading from "./section-heading";
import { useSectionInView } from "@/hooks/use-sectionIn-view";
import { RichTextViewer } from "@/components/ui/rich-text-viewer";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * index,
      duration: 0.5,
    },
  }),
};

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
}

interface EducationProps {
  educations: EducationItem[];
}

const Education = ({ educations }: EducationProps) => {
  const { ref } = useSectionInView("Education", 0.5);

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

  if (educations.length === 0) return null;

  return (
    <section
      id="education"
      ref={ref}
      className="scroll-mt-28 mb-28 sm:mb-40 max-w-4xl mx-auto"
    >
      <SectionHeading>My Education</SectionHeading>

      <div className="grid gap-6 md:grid-cols-2">
        {educations.map((item, index) => (
          <motion.div
            key={item.id}
            className="group relative"
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            custom={index}
          >
            <div className="relative h-full p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {item.degree}
                      </h3>
                      <p className="flex items-center gap-1 text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        {item.institution}
                      </p>
                    </div>
                    {item.current && (
                      <span className="flex-shrink-0 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <Calendar className="w-3 h-3" />
                    <time>
                      {formatDateRange(item.startDate, item.endDate, item.current)}
                    </time>
                  </div>

                  {item.description && (
                    <RichTextViewer
                      content={item.description}
                      className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed"
                    />
                  )}
                </div>
              </div>

              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Education;
