"use client";

import { format } from "date-fns";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

interface ResumePreviewProps {
  content: {
    personal?: {
      fullName?: string;
      email?: string;
      phone?: string;
      location?: string;
      linkedin?: string;
      website?: string;
    };
    summary?: string;
  };
  experiences: Array<{
    id: string;
    title: string;
    location: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: Date;
    endDate?: Date | null;
  }>;
  skills: Array<{
    id: string;
    title: string;
  }>;
  themeColor: string;
}

export default function ResumePreview({
  content,
  experiences,
  educations,
  skills,
  themeColor,
}: ResumePreviewProps) {
  const personal = content.personal || {};

  return (
    <div
      className="bg-white shadow-lg rounded-sm"
      style={{ aspectRatio: "8.5/11", minHeight: "1056px" }}
    >
      <div className="p-8 h-full">
        {/* Header / Personal Info */}
        <header className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: themeColor }}
          >
            {personal.fullName || "Your Name"}
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            {personal.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {personal.email}
              </span>
            )}
            {personal.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {personal.phone}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {personal.location}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="h-3.5 w-3.5" />
                {personal.linkedin}
              </span>
            )}
            {personal.website && (
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                {personal.website}
              </span>
            )}
          </div>
        </header>

        {/* Summary */}
        {content.summary && (
          <section className="mb-6">
            <h2
              className="text-lg font-semibold mb-2 pb-1 border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {content.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="mb-6">
            <h2
              className="text-lg font-semibold mb-3 pb-1 border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-sm text-gray-600">{exp.location}</p>
                    </div>
                    <span className="text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                      {format(new Date(exp.endDate), "MMM yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <section className="mb-6">
            <h2
              className="text-lg font-semibold mb-3 pb-1 border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {format(new Date(edu.startDate), "MMM yyyy")} -{" "}
                    {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h2
              className="text-lg font-semibold mb-3 pb-1 border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 text-sm rounded-md text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
