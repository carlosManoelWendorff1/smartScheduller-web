"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Briefcase,
  UserRound,
  Box,
  CalendarDays,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import type { SessionUser } from "@/lib/session";

const NAV_ITEMS = [
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/services", label: "Serviços", icon: Briefcase },
  { href: "/professionals", label: "Profissionais", icon: UserRound },
  { href: "/resources", label: "Recursos", icon: Box },
  { href: "/appointments", label: "Agendamentos", icon: CalendarDays },
];

export function AppSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

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
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
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
                        <span>Usuários (admin)</span>
                      </Link>
                    }
                    isActive={pathname.startsWith("/admin")}
                    tooltip="Usuários (admin)"
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
            <div className="px-2 py-1 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              Papel: {user.role}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair">
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
