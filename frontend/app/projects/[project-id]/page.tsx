"use client";

import { FC, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import {
  getPlatformDisplayName,
  getPlatformIcon,
  getSocialMediaLinks,
} from "@/lib/utils/socialMedia";
import { formatDate } from "@/lib/utils/formatting";
import { ProjectRow } from "@/lib/utils/types";

const ProjectDetailPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params["project-id"] as string;

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          throw new Error("Project not found");
        }

        setProject(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load project details");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Project not found"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/projects")}>
              Back to Projects
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const socialMediaLinks = getSocialMediaLinks(project);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/projects")}
          className="mb-4"
        >
          ← Back to Projects
        </Button>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Created {formatDate(project.created_at)}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                project.scf_link && window.open(project.scf_link, "_blank")
              }
              disabled={!project.scf_link}
            >
              View on SCF
            </Button>
            <Button>Support Project</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About the Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.description}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Email</h3>
                <a
                  href={`mailto:${project.email}`}
                  className="text-primary hover:underline"
                >
                  {project.email}
                </a>
              </div>

              {socialMediaLinks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Social Media</h3>
                  <div className="space-y-2">
                    {socialMediaLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-primary hover:underline"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                          {getPlatformIcon(link.platform)}
                        </div>
                        {getPlatformDisplayName(link.platform)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
