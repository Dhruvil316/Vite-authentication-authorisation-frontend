import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export function TeamSwitcher({
  team,
}: {
  team: {
    name: string;
    // logo: React.ElementType;
    id: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
        >
          <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {/* <team.logo className="size-4" /> */}
            T
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{team.name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
