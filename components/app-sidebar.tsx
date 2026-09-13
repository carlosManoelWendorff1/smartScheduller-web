"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Users,
  Briefcase,
  UserRound,
  Box,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import type { SessionUser } from "@/lib/session";

export function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const NAV_ITEMS = [
    { href: "/customers", label: t("customers"), icon: Users },
    { href: "/services", label: t("services"), icon: Briefcase },
    { href: "/professionals", label: t("professionals"), icon: UserRound },
    { href: "/resources", label: t("resources"), icon: Box },
    { href: "/appointments", label: t("appointments"), icon: CalendarDays },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
            SS
          </div>
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            SmartScheduller
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {t("customers") ? "Menu" : "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                    render={
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}

              {user.role === "ADMIN" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    render={
                      <Link href="/admin/users">
                        <ShieldCheck />
                        <span>{t("adminUsers")}</span>
                      </Link>
                    }
                    isActive={pathname.startsWith("/admin")}
                    tooltip={t("adminUsers")}
                  />
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu user={user} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
