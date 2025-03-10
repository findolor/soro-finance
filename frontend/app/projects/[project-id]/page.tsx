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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import EmptyMilestones from "@/components/projects/EmptyMilestones";
import Header from "@/components/ui/header";
import { toast } from "sonner";

// Test data for milestones
const TEST_MILESTONES = [
  {
    id: 1,
    name: "Initial Research & Planning",
    timeline: "May 2023 - June 2023",
    development: "Research market needs and create project roadmap",
    budget: {
      teamMembers: [
        {
          name: "John Doe",
          role: "Project Lead",
          monthlyCost: 5000,
          walletAddress: "0x1234...5678",
        },
        {
          name: "Jane Smith",
          role: "Researcher",
          monthlyCost: 3500,
          walletAddress: null,
        },
      ],
      thirdPartyServices: [
        {
          name: "Market Research Tool",
          monthlyCost: 500,
        },
      ],
    },
  },
  {
    id: 2,
    name: "MVP Development",
    timeline: "July 2023 - September 2023",
    development: "Develop core features and initial prototype",
    budget: {
      teamMembers: [
        {
          name: "John Doe",
          role: "Project Lead",
          monthlyCost: 5000,
          walletAddress: "0x1234...5678",
        },
        {
          name: "Alex Johnson",
          role: "Frontend Developer",
          monthlyCost: 4000,
          walletAddress: "0x8765...4321",
        },
        {
          name: "Sarah Williams",
          role: "Backend Developer",
          monthlyCost: 4200,
          walletAddress: null,
        },
      ],
      thirdPartyServices: [
        {
          name: "Cloud Hosting",
          monthlyCost: 300,
        },
        {
          name: "CI/CD Pipeline",
          monthlyCost: 200,
        },
      ],
    },
  },
];

const ProjectDetailPage: FC = () => {
  const params = useParams();
  const projectId = params["project-id"] as string;

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<typeof TEST_MILESTONES>([]);
  const [refreshMilestones, setRefreshMilestones] = useState(0);

  // For debugging purposes
  console.log("Available test milestones:", TEST_MILESTONES.length);

  // Function to toggle between test data and empty state for development purposes
  const toggleTestData = () => {
    if (milestones.length === 0) {
      setMilestones(TEST_MILESTONES);
    } else {
      setMilestones([]);
    }
  };

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

        // Start with empty state by default
        setMilestones([]);
      } catch {
        toast.error("Failed to load milestones");
      }
    };

    loadMilestones();
  }, [projectId, refreshMilestones]);

  const handleMilestoneCreated = () => {
    // Trigger a refresh of milestones
    setRefreshMilestones((prev) => prev + 1);
  };

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
    <div className="w-full py-8">
      <Header
        title={project.name}
        showBackButton={true}
        backButtonUrl="/projects"
      >
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

      {/* Milestones Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Project Milestones</h2>

          {/* Development-only toggle button */}
          {process.env.NODE_ENV === "development" && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTestData}
              className="text-xs"
            >
              Toggle Test Data
            </Button>
          )}
        </div>

        {milestones.length > 0 ? (
          <>
            {/* Total Project Budget Summary - Moved to top */}
            <Card className="mb-8 border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Total Project Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Calculate total duration */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Timeline:</span>
                    <span>
                      {milestones[0]?.timeline.split(" - ")[0]} -{" "}
                      {
                        milestones[milestones.length - 1]?.timeline.split(
                          " - "
                        )[1]
                      }
                    </span>
                  </div>

                  {/* Calculate total team members cost */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Total Team Members Cost:
                    </span>
                    <span className="font-semibold">
                      $
                      {milestones
                        .reduce(
                          (total, milestone) =>
                            total +
                            milestone.budget.teamMembers.reduce(
                              (sum, member) => sum + member.monthlyCost,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>

                  {/* Calculate total third-party services cost */}
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      Total 3rd Party Services Cost:
                    </span>
                    <span className="font-semibold">
                      $
                      {milestones
                        .reduce(
                          (total, milestone) =>
                            total +
                            milestone.budget.thirdPartyServices.reduce(
                              (sum, service) => sum + service.monthlyCost,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  {/* Calculate grand total */}
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Grand Total:</span>
                    <span className="font-bold text-primary">
                      $
                      {milestones
                        .reduce(
                          (total, milestone) =>
                            total +
                            milestone.budget.teamMembers.reduce(
                              (sum, member) => sum + member.monthlyCost,
                              0
                            ) +
                            milestone.budget.thirdPartyServices.reduce(
                              (sum, service) => sum + service.monthlyCost,
                              0
                            ),
                          0
                        )
                        .toLocaleString()}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground mt-2">
                    <p>* Monthly costs aggregated across all milestones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          Milestone {milestone.id}
                        </div>
                        <CardTitle className="text-xl">
                          {milestone.name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="font-normal">
                        {milestone.timeline}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* General Information */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          General Information
                        </h3>
                        <p>{milestone.development}</p>
                      </div>

                      <Separator />

                      {/* Budget Breakdown */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Budget Breakdown
                        </h3>

                        {/* Team Members */}
                        <div className="mb-6">
                          <h4 className="text-md font-medium mb-3">
                            Team Members
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Monthly Cost</TableHead>
                                <TableHead>Wallet Address</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {milestone.budget.teamMembers.map(
                                (member, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      {member.name}
                                    </TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>
                                      ${member.monthlyCost.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                      {member.walletAddress ? (
                                        <span className="text-xs font-mono">
                                          {member.walletAddress}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground text-sm">
                                          Not provided
                                        </span>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Third Party Services */}
                        {milestone.budget.thirdPartyServices.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium mb-3">
                              3rd Party Services
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Service</TableHead>
                                  <TableHead>Monthly Cost</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {milestone.budget.thirdPartyServices.map(
                                  (service, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="font-medium">
                                        {service.name}
                                      </TableCell>
                                      <TableCell>
                                        ${service.monthlyCost.toLocaleString()}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* Total Monthly Cost */}
                        <div className="mt-4 text-right">
                          <p className="font-semibold">
                            Total Monthly Cost: $
                            {(
                              milestone.budget.teamMembers.reduce(
                                (sum, member) => sum + member.monthlyCost,
                                0
                              ) +
                              milestone.budget.thirdPartyServices.reduce(
                                (sum, service) => sum + service.monthlyCost,
                                0
                              )
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <EmptyMilestones
            projectId={projectId}
            onMilestoneCreated={handleMilestoneCreated}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
