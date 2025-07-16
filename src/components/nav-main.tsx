// src/components/NavMain.tsx

import {NavLink} from "react-router"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";

export function NavMain({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded ${
                    isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
                  }`
                }
              >
                <item.icon />
                <span>{item.name}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
