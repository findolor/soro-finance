"use client";

import { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import {
  getPlatformDisplayName,
  getPlatformIcon,
  getSocialMediaLinks,
} from "@/lib/utils/socialMedia";
import { ProjectRow } from "@/lib/utils/types";
import { ExternalLink } from "lucide-react";
import Header from "@/components/ui/header";
import { toast } from "sonner";
import BudgetBreakdownReadOnly from "@/components/budget/BudgetBreakdownReadOnly";

const ProjectDetailPage: FC = () => {
  const params = useParams();
  const projectId = params["project-id"] as string;

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch project data from Supabase
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) {
          throw error;
        }
        if (!data) {
          throw new Error();
        }

        setProject(data);
        setLoading(false);
      } catch {
        toast.error("Failed to load project details");
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Fetch or load milestones
  useEffect(() => {
    // TODO: Replace with actual API call when Supabase schema is set up
    // For now, just use test data (TEST_MILESTONES)
    const loadMilestones = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch {
        toast.error("Failed to load milestones");
      }
    };

    loadMilestones();
  }, [projectId]);

  if (loading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        {/* Skeleton loading state */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full py-8">
        <Header
          title="Project Details"
          showBackButton={true}
          backButtonUrl="/projects"
        >
          {/* Additional buttons can be added here if needed */}
        </Header>
      </div>
    );
  }

  const socialMediaLinks = getSocialMediaLinks(project);

  return (
    <div className="w-full">
      <Header title={project.name}>
        {project.scf_link && (
          <Button
            variant="outline"
            onClick={() => {
              if (project.scf_link) {
                window.open(project.scf_link, "_blank");
              }
            }}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View SCF Project
          </Button>
        )}
      </Header>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">About</h3>
              <p className="whitespace-pre-line">{project.description}</p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Contact Details</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <a
                    href={`mailto:${project.email}`}
                    className="text-primary hover:underline"
                  >
                    {project.email}
                  </a>
                </div>

                {socialMediaLinks.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Social Media</h4>
                    <div className="flex flex-wrap gap-3">
                      {socialMediaLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-md"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                            {getPlatformIcon(link.platform)}
                          </div>
                          {getPlatformDisplayName(link.platform)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Breakdown Section */}
        <BudgetBreakdownReadOnly />
      </div>
    </div>
  );
};

export default ProjectDetailPage;
