"use client";

import * as React from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <DynamicBreadcrumb />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 w-full">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
