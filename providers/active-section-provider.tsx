"use client";

import React, { useState, createContext, useContext } from "react";

import { SectionName } from "@/lib/type";

type ActiveSectionProviderProps = {
  children: React.ReactNode;
};

type ActiveSectionType = {
  activeSection: SectionName;
  setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>;
  timeOfLastClick: number;
  setTimeOfLastClick: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveSection = createContext<ActiveSectionType | null>(null);

export default function ActiveSectionProvider({
  children,
}: ActiveSectionProviderProps) {
  const [activeSection, setActiveSection] = useState<SectionName>("Home");
  const [timeOfLastClick, setTimeOfLastClick] = useState(0); // we need to keep track of this to disable the observer temporarily when user clicks on a link

  return (
    <ActiveSection.Provider
      value={{
        activeSection,
        setActiveSection,
        timeOfLastClick,
        setTimeOfLastClick,
      }}
    >
      {children}
    </ActiveSection.Provider>
  );
}

export function useActiveSection() {
  const context = useContext(ActiveSection);

  if (context === null) {
    throw new Error(
      "useActiveSection must be used within an ActiveSectionProvider"
    );
  }

  return context;
}
