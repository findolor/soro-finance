"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Define route mappings for human-readable names
const routeMappings: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  create: "Create Project",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") {
    return null;
  }

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    // Check if this is a dynamic route segment (starts with '[' and ends with ']')
    const isDynamicSegment = segment.startsWith("[") && segment.endsWith("]");

    // For dynamic segments, try to make them more readable
    const displayName = isDynamicSegment
      ? segment.replace(/^\[|\]$/g, "").replace(/-/g, " ")
      : routeMappings[segment] || segment;

    // Construct the href for this breadcrumb
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Determine if this is the last segment (current page)
    const isLastSegment = index === segments.length - 1;

    return (
      <React.Fragment key={href}>
        {index > 0 && <BreadcrumbSeparator />}
        <BreadcrumbItem>
          {isLastSegment ? (
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={href}>{displayName}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </React.Fragment>
    );
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
    </Breadcrumb>
  );
}
