"use client";

import {
  Home,
  ListCollapse,
  PanelRightClose,
  Settings,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { UserSession } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface AppSidebarProps {
  user: UserSession | null | undefined;
}

// TODO: Control page for controlling the queue if something wrong happens. Example: remove all jobs, see all jobs, force stop/ start job etc.

export function DashboardSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile, toggleSidebar, isMobile, state } = useSidebar();

  const commonOnClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const menuItems: NavItem[] = [
    {
      icon: <Home className="h-4 w-4" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <ListCollapse className="h-4 w-4" />,
      label: "Call History",
      href: "/dashboard/history",
    },
    {
      icon: <Settings2 className="h-4 w-4" />,
      label: "Preferences",
      href: "/dashboard/preferences",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      href: "/dashboard/settings",
    },
  ];

  const renderMenuItems = (items: NavItem[]) =>
    items.map((item) => {
      const isActive = pathname === item.href;

      return (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={isActive}
            onClick={commonOnClick}
          >
            <Link href={item.href} className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="bg-primary/10 ml-auto rounded-full px-2 py-0.5 text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar collapsible="icon" className="group/sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Logo size="sm" />
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:sr-only">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(menuItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Collapse Toggle - Only show when expanded */}
      <div className="mt-auto border-t p-2 group-data-[collapsible=icon]:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <PanelRightClose className="h-4 w-4" />
          <span>Collapse</span>
        </Button>
      </div>
    </Sidebar>
  );
}
