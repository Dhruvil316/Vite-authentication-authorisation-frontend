// src/components/AppSidebar.tsx
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

interface AppSidebarProps {
  data: {
    teams: { name: string; id: string }[];
    navMain: { name: string; url: string; icon: any }[];
    user: { name: string; email: string };
  };
}

export function AppSidebar({ data, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={data.teams[0]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
