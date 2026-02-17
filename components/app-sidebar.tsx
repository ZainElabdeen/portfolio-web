import { Briefcase, Layers, Star, FileText, GraduationCap, User } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Layers,
  },
  {
    title: "Experience",
    url: "/dashboard/experience",
    icon: Briefcase,
  },
  {
    title: "Skills",
    url: "/dashboard/skills",
    icon: Star,
  },
  {
    title: "Education",
    url: "/dashboard/education",
    icon: GraduationCap,
  },
  {
    title: "Resumes",
    url: "/dashboard/resumes",
    icon: FileText,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
