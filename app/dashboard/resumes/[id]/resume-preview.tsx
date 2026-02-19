"use client";

import { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";

// A4 at 96 dpi
const A4_H = 1123;
const A4_W = 794;
const SCALE = 0.82;

// Margin applied at the top of every page (matches @page margin in globals.css)
const PAGE_MARGIN_TOP = 52;
const PAGE_MARGIN_X   = 56;
// Bottom margin so content never touches the very bottom of a page
const PAGE_MARGIN_BOT = 40;

function stripHtml(html: string): string {
  if (!html) return "";
  let text = html.replace(/<[^>]*>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
}

interface PersonalInfo {
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

export interface ResumePreviewProps {
  personal: PersonalInfo;
  summary: string;
  experiences: Array<{
    id: string;
    title: string;
    companyName?: string | null;
    location?: string | null;
    description: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
  }>;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: Date;
    endDate?: Date | null;
    current: boolean;
  }>;
  skills: Array<{ id: string; title: string }>;
  themeColor: string;
}

function SectionHeading({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 11, fontWeight: 700, color,
      borderBottom: `2px solid ${color}`,
      paddingBottom: 3, marginBottom: 8, marginTop: 0,
      textTransform: "uppercase", letterSpacing: "0.06em",
    }}>
      {children}
    </h2>
  );
}

/** Spacer rendered BEFORE a block — fills the bottom of the current page
 *  AND adds the top margin so content starts with proper spacing on the new page. */
function PageBreakSpacer({ blockKey, spacers }: { blockKey: string; spacers: Record<string, number> }) {
  const h = spacers[blockKey];
  if (!h) return null;
  return <div aria-hidden style={{ height: h }} />;
}

export default function ResumePreview(props: ResumePreviewProps) {
  const { personal, summary, experiences, educations, skills, themeColor } = props;

  const measureRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(A4_H);
  // spacers[blockKey] = px to insert before that block to push it to next page
  const [spacers, setSpacers] = useState<Record<string, number>>({});
  const passRef = useRef(0);

  const recalc = () => {
    const container = measureRef.current;
    if (!container) return;

    container.getBoundingClientRect(); // flush
    const containerTop = container.getBoundingClientRect().top;
    const blocks = container.querySelectorAll<HTMLElement>("[data-block]");
    const next: Record<string, number> = {};

    blocks.forEach((block) => {
      const key = block.getAttribute("data-block")!;
      const rect = block.getBoundingClientRect();
      const blockTop    = rect.top  - containerTop;
      const blockHeight = rect.height;
      if (blockHeight === 0) return;

      // Which A4 page does this block start on?
      const pageIndex       = Math.floor(blockTop / A4_H);
      // How much of the current page has already been used?
      const posInPage       = blockTop - pageIndex * A4_H;
      // How much room is left on this page (excluding bottom margin)?
      const usableHeight    = A4_H - PAGE_MARGIN_BOT;
      const remainingOnPage = usableHeight - posInPage;

      // Does the block overflow onto the next page?
      if (remainingOnPage < blockHeight) {
        const fractionOnNext = (blockHeight - remainingOnPage) / blockHeight;
        if (fractionOnNext >= 0.5) {
          // Push entire block to next page.
          // Spacer = gap to end of page + top margin of new page
          next[key] = (A4_H - posInPage - pageIndex * 0) + PAGE_MARGIN_TOP;
        }
      }
    });

    setTimeout(() => setSpacers(next), 0);
  };

  // Pass 1 — on content change
  useEffect(() => {
    passRef.current = 0;
    recalc();
  }, [personal, summary, experiences, educations, skills, themeColor]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pass 2 — once after spacers are applied (cascading shifts)
  useEffect(() => {
    if (passRef.current >= 1) return;
    passRef.current += 1;
    recalc();
  }, [spacers]);

  // Track total height via ResizeObserver
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (measureRef.current) setContentHeight(measureRef.current.scrollHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pageCount  = Math.ceil(contentHeight / A4_H);
  const GAP        = 20; // gap between page cards in the preview
  const scaledW    = A4_W  * SCALE;
  const scaledH    = (pageCount * A4_H + (pageCount - 1) * GAP) * SCALE;

  const contentProps = { ...props, spacers };

  return (
    <>
      {/* ── Hidden measurement div — full 794px, invisible ───────────── */}
      <div
        ref={measureRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0, left: -9999,
          width: A4_W,
          visibility: "hidden",
          pointerEvents: "none",
          fontFamily: "Georgia,'Times New Roman',serif",
          fontSize: 13,
        }}
      >
        <ResumeContent {...contentProps} />
      </div>

      {/* ── On-screen scaled preview ─────────────────────────────────── */}
      <div className="print:hidden relative" style={{ width: scaledW, height: scaledH, flexShrink: 0 }}>
        <div style={{ transformOrigin: "top left", transform: `scale(${SCALE})`, width: A4_W, position: "absolute", top: 0, left: 0 }}>

          {/* Page count badge */}
          <div style={{ position: "absolute", top: -22, right: 0, fontSize: 11, color: "#9ca3af", fontFamily: "Arial,sans-serif" }}>
            {pageCount} page{pageCount !== 1 ? "s" : ""}
          </div>

          {/* Single continuous white sheet — always light mode */}
          <div style={{ width: A4_W, backgroundColor: "#fff", color: "#111827", colorScheme: "light", boxShadow: "0 4px 32px rgba(0,0,0,0.14)" }}>
            <ResumeContent {...contentProps} />
          </div>

          {/* Visual page-break lines overlaid on the sheet */}
          {Array.from({ length: pageCount - 1 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: (i + 1) * A4_H - 1,
                left: 0, right: 0,
                height: 3,
                background: "#6366f1",
                opacity: 0.35,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Print-only — browser adds @page margins automatically ────── */}
      <div
        className="hidden print:block"
        style={{
          width: A4_W,
          fontFamily: "Georgia,'Times New Roman',serif",
          fontSize: 13,
          color: "#111827",
        }}
      >
        <ResumeContent {...contentProps} printMode />
      </div>
    </>
  );
}

// ─── Content ────────────────────────────────────────────────────────────────

interface ResumeContentProps extends ResumePreviewProps {
  spacers: Record<string, number>;
  printMode?: boolean;
}

function ResumeContent({ personal, summary, experiences, educations, skills, themeColor, spacers, printMode }: ResumeContentProps) {
  return (
    // Explicit light-mode colors so dark OS theme / .dark class never bleeds into the PDF
    <div style={{ padding: `${PAGE_MARGIN_TOP}px ${PAGE_MARGIN_X}px ${PAGE_MARGIN_BOT}px`, backgroundColor: "#ffffff", color: "#111827", colorScheme: "light" }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header style={{ marginBottom: 18, borderBottom: `3px solid ${themeColor}`, paddingBottom: 14 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: themeColor, margin: 0, lineHeight: 1.2, fontFamily: "Georgia,serif" }}>
          {personal.fullName || "Your Name"}
        </h1>
        {personal.title && (
          <p style={{ fontSize: 13, color: "#374151", margin: "4px 0 0", fontStyle: "italic", fontFamily: "Georgia,serif" }}>
            {personal.title}
          </p>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginTop: 8, fontSize: 11, color: "#4b5563", fontFamily: "Arial,sans-serif" }}>
          {personal.email    && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Mail     style={{ width: 11, height: 11, color: "#4b5563", flexShrink: 0 }} />{personal.email}</span>}
          {personal.phone    && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Phone    style={{ width: 11, height: 11, color: "#4b5563", flexShrink: 0 }} />{personal.phone}</span>}
          {personal.location && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin   style={{ width: 11, height: 11, color: "#4b5563", flexShrink: 0 }} />{personal.location}</span>}
          {personal.linkedin && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Linkedin style={{ width: 11, height: 11, color: "#4b5563", flexShrink: 0 }} />{personal.linkedin}</span>}
          {personal.website  && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Globe    style={{ width: 11, height: 11, color: "#4b5563", flexShrink: 0 }} />{personal.website}</span>}
        </div>
      </header>

      {/* ── Summary ────────────────────────────────────────────────────── */}
      {summary && (
        <>
          <PageBreakSpacer blockKey="summary" spacers={spacers} />
          <section data-block="summary" style={{ marginBottom: 16, breakInside: "avoid" }}>
            <SectionHeading color={themeColor}>Summary</SectionHeading>
            <p style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.65, margin: 0, fontFamily: "Arial,sans-serif" }}>
              {stripHtml(summary)}
            </p>
          </section>
        </>
      )}

      {/* ── Experience ─────────────────────────────────────────────────── */}
      {experiences.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {experiences.map((exp, idx) => (
              <div key={exp.id}>
                <PageBreakSpacer blockKey={`exp-${exp.id}`} spacers={spacers} />
                <div data-block={`exp-${exp.id}`} style={{ breakInside: "avoid" }}>
                  {idx === 0 && <SectionHeading color={themeColor}>Professional Experience</SectionHeading>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Arial,sans-serif" }}>{exp.title}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0", fontFamily: "Arial,sans-serif" }}>
                        {exp.companyName}{exp.companyName && exp.location ? " · " : ""}{exp.location}
                      </p>
                    </div>
                    <span style={{ fontSize: 10.5, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "Arial,sans-serif" }}>
                      {format(new Date(exp.startDate), "MMM yyyy")} –{" "}
                      {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : "Present"}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, margin: "4px 0 0", fontFamily: "Arial,sans-serif" }}>
                    {stripHtml(exp.description)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education ──────────────────────────────────────────────────── */}
      {educations.length > 0 && (
        <section style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {educations.map((edu, idx) => (
              <div key={edu.id}>
                <PageBreakSpacer blockKey={`edu-${edu.id}`} spacers={spacers} />
                <div data-block={`edu-${edu.id}`} style={{ breakInside: "avoid" }}>
                  {idx === 0 && <SectionHeading color={themeColor}>Education</SectionHeading>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: "#111827", margin: 0, fontFamily: "Arial,sans-serif" }}>{edu.degree}</p>
                      <p style={{ fontSize: 11, color: "#6b7280", margin: "2px 0 0", fontFamily: "Arial,sans-serif" }}>{edu.institution}</p>
                    </div>
                    <span style={{ fontSize: 10.5, color: "#9ca3af", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "Arial,sans-serif" }}>
                      {format(new Date(edu.startDate), "MMM yyyy")} –{" "}
                      {edu.current ? "Present" : edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Skills ─────────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <>
          <PageBreakSpacer blockKey="skills" spacers={spacers} />
          <section data-block="skills" style={{ breakInside: "avoid" }}>
            <SectionHeading color={themeColor}>Skills</SectionHeading>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {skills.map((skill) => (
                <span key={skill.id} style={{ padding: "3px 9px", fontSize: 10.5, fontWeight: 600, borderRadius: 3, color: "#fff", backgroundColor: themeColor, fontFamily: "Arial,sans-serif" }}>
                  {skill.title}
                </span>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Bottom padding so last item never touches the page-break line */}
      {!printMode && <div style={{ height: PAGE_MARGIN_BOT }} />}
    </div>
  );
}
