"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { ProjectRow } from "@/lib/utils/types";
import { formatDate, truncateText } from "@/lib/utils/formatting";

const ProjectsPage: FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch all projects from Supabase
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load projects");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    router.push("/projects/create");
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Skeleton className="h-10 w-36" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={handleCreateProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            Browse through all available projects or create a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 p-4 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No projects found. Be the first to create one!
              </p>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    onClick={() => handleRowClick(project.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>
                      {truncateText(project.description, 100)}
                    </TableCell>
                    <TableCell>{formatDate(project.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
