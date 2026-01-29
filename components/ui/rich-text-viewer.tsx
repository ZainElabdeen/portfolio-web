"use client";

import { cn } from "@/lib/utils";

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
  if (!content) return null;

  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-p:my-2",
        "prose-ul:my-2 prose-ul:list-disc prose-ul:pl-4",
        "prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-4",
        "prose-li:my-0.5",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
