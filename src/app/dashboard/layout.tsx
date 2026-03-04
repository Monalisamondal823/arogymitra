"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  FileScan,
  MessageSquare,
  ShieldAlert,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { useAuth, useUser } from "@/firebase";
import { useEffect } from "react";
import { signOut } from "firebase/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

function Logo() {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2"
      aria-label="Back to dashboard"
    >
      <div className="bg-primary/10 p-2 rounded-lg">
        <HeartPulse className="h-6 w-6 text-primary" />
      </div>
      <h1 className="text-lg font-headline font-bold hidden group-data-[state=expanded]:inline">
        ArogyaMitra
      </h1>
    </Link>
  );
}

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/diagnostics", icon: Stethoscope, label: "AI Diagnostics" },
  { href: "/dashboard/radiology", icon: FileScan, label: "Radiology Analysis" },
{
    href: "/dashboard/communication",
    icon: MessageSquare,
    label: "Communication Assist",
  },
  {
    href: "/dashboard/risk-alerts",
    icon: ShieldAlert,
    label: "Risk Alerts",
  },
  { href: "/dashboard/admin", icon: ClipboardList, label: "Admin Tasks" },
];

function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{
              children: item.label,
              className: "font-body",
            }}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function UserMenu() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const router = useRouter();
    const avatarImage = PlaceHolderImages.find(p => p.id === 'user-avatar');

    const handleLogout = async () => {
      await signOut(auth);
      router.push('/login');
    };

    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    const fallbackInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user?.photoURL || avatarImage?.imageUrl} alt={user?.displayName || "User"} data-ai-hint={avatarImage?.imageHint} />
                <AvatarFallback>{fallbackInitial}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 font-body" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <UserMenu />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-4 md:gap-8">
            {children}
        </div>
      </SidebarInset>
    </>
  );
}
