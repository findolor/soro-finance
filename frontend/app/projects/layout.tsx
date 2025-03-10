"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Wallet, LayoutDashboard } from "lucide-react";
import useWallet from "@/lib/hooks/useWallet";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { connect, disconnect, walletAddress, isConnected } = useWallet();

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-bold">Soro Finance</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={true} tooltip="Projects">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Projects
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            {isConnected ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 truncate">
                  {walletAddress}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={disconnect}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button className="w-full" onClick={connect}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
