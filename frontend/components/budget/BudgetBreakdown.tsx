import { FC, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamMemberForm from "./TeamMemberForm";
import ThirdPartyServiceForm from "./ThirdPartyServiceForm";
import MilestoneForm from "./MilestoneForm";
import { InfoIcon } from "lucide-react";
import { differenceInDays, differenceInMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, addDays } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tables } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// Define types based on Supabase schema
export type TeamMember = Omit<
  Tables<"team_members">,
  "created_at" | "updated_at" | "project_id"
> & {
  id: number; // Keep id as number for local state management
};

export type ThirdPartyService = Omit<
  Tables<"third_party_services">,
  "created_at" | "updated_at" | "project_id"
> & {
  id: number; // Keep id as number for local state management
};

export type Deliverable = Omit<
  Tables<"deliverables">,
  "created_at" | "updated_at" | "milestone_id"
> & {
  id: number; // Keep id as number for local state management
};

export interface Milestone
  extends Omit<
    Tables<"milestones">,
    | "created_at"
    | "updated_at"
    | "project_id"
    | "date_range_start"
    | "date_range_end"
  > {
  id: number; // Keep id as number for local state management
  dateRange?: {
    from: Date;
    to: Date;
  };
  teamMemberIds: number[];
  serviceIds: number[];
  deliverables: Deliverable[];
  isExpanded?: boolean;
}

interface BudgetBreakdownProps {
  projectId: string;
}

const BudgetBreakdown: FC<BudgetBreakdownProps> = ({ projectId }) => {
  // Initialize with one empty team member
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 0,
      name: "",
      role: "",
      daily_cost: 0,
      wallet_address: null,
    },
  ]);

  // Initialize with one empty third party service
  const [thirdPartyServices, setThirdPartyServices] = useState<
    ThirdPartyService[]
  >([
    {
      id: 0,
      name: "",
      monthly_cost: 0,
    },
  ]);

  // Initialize with empty milestones array
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Calculate the total budget
  const budgetSummary = useMemo(() => {
    let totalTeamCost = 0;
    let totalServiceCost = 0;

    // Process each milestone
    milestones.forEach((milestone) => {
      if (!milestone.dateRange?.from || !milestone.dateRange?.to) {
        return; // Skip milestones without date ranges
      }

      const startDate = new Date(milestone.dateRange.from);
      const endDate = new Date(milestone.dateRange.to);
      const durationInDays = differenceInDays(endDate, startDate) + 1; // +1 to include both start and end days

      // Calculate team member costs for this milestone
      milestone.teamMemberIds.forEach((memberId) => {
        const member = teamMembers.find((m) => m.id === memberId);
        if (member) {
          totalTeamCost += member.daily_cost * durationInDays;
        }
      });

      // Calculate service costs for this milestone
      // For services, we'll calculate based on months or partial months
      const durationInMonths = differenceInMonths(endDate, startDate) + 1; // +1 to include partial months

      milestone.serviceIds.forEach((serviceId) => {
        const service = thirdPartyServices.find((s) => s.id === serviceId);
        if (service) {
          totalServiceCost += service.monthly_cost * durationInMonths;
        }
      });
    });

    const totalBudget = totalTeamCost + totalServiceCost;

    return {
      teamCost: totalTeamCost,
      serviceCost: totalServiceCost,
      totalBudget: totalBudget,
    };
  }, [teamMembers, thirdPartyServices, milestones]);

  // Create a complete budget object with all data
  const completeBudgetData = {
    teamMembers,
    thirdPartyServices,
    milestones,
    budgetSummary,
  };

  // Handle create button click
  const handleCreateBudget = async () => {
    const supabase = createClient();

    console.log(JSON.stringify(completeBudgetData, null, 2));

    try {
      // Step 1: Insert team members
      const teamMemberPromises = teamMembers.map(async (member) => {
        const { name, role, daily_cost, wallet_address } = member;
        const { data, error } = await supabase
          .from("team_members")
          .insert({
            project_id: projectId,
            name,
            role,
            daily_cost,
            wallet_address,
          })
          .select("id")
          .single();

        if (error)
          throw new Error(`Error inserting team member: ${error.message}`);
        return data;
      });

      const insertedTeamMembers = await Promise.all(teamMemberPromises);
      const teamMemberIds = insertedTeamMembers.map((member) => member.id);

      // Step 1 (parallel): Insert third-party services
      const servicePromises = thirdPartyServices.map(async (service) => {
        const { name, monthly_cost } = service;
        const { data, error } = await supabase
          .from("third_party_services")
          .insert({
            project_id: projectId,
            name,
            monthly_cost,
          })
          .select("id")
          .single();

        if (error) throw new Error(`Error inserting service: ${error.message}`);
        return data;
      });

      const insertedServices = await Promise.all(servicePromises);
      const serviceIds = insertedServices.map((service) => service.id);

      // Step 2: Insert milestones
      const milestonePromises = milestones.map(async (milestone) => {
        const { name, description, dateRange } = milestone;

        if (!dateRange) throw new Error("Milestone date range is required");

        const { data, error } = await supabase
          .from("milestones")
          .insert({
            project_id: projectId,
            name,
            description,
            date_range_start: dateRange.from.toISOString().split("T")[0],
            date_range_end: dateRange.to.toISOString().split("T")[0],
          })
          .select("id")
          .single();

        if (error)
          throw new Error(`Error inserting milestone: ${error.message}`);
        return { ...data, originalMilestone: milestone };
      });

      const insertedMilestones = await Promise.all(milestonePromises);

      // Step 3: Insert deliverables for each milestone
      for (const { id: milestoneId, originalMilestone } of insertedMilestones) {
        const deliverablePromises = originalMilestone.deliverables.map(
          async (deliverable) => {
            const { name, description } = deliverable;
            const { error } = await supabase.from("deliverables").insert({
              milestone_id: milestoneId,
              name,
              description,
            });

            if (error)
              throw new Error(`Error inserting deliverable: ${error.message}`);
          }
        );

        await Promise.all(deliverablePromises);

        // Step 4a: Insert milestone-team member relationships
        for (const teamMemberId of originalMilestone.teamMemberIds) {
          // Find the corresponding inserted team member ID
          const actualTeamMemberId =
            teamMemberIds[teamMembers.findIndex((m) => m.id === teamMemberId)];

          if (actualTeamMemberId) {
            const { error } = await supabase
              .from("milestone_team_members")
              .insert({
                milestone_id: milestoneId,
                team_member_id: actualTeamMemberId,
              });

            if (error)
              throw new Error(
                `Error linking team member to milestone: ${error.message}`
              );
          }
        }

        // Step 4b: Insert milestone-service relationships
        for (const serviceId of originalMilestone.serviceIds) {
          // Find the corresponding inserted service ID
          const actualServiceId =
            serviceIds[thirdPartyServices.findIndex((s) => s.id === serviceId)];

          if (actualServiceId) {
            const { error } = await supabase.from("milestone_services").insert({
              milestone_id: milestoneId,
              service_id: actualServiceId,
            });

            if (error)
              throw new Error(
                `Error linking service to milestone: ${error.message}`
              );
          }
        }
      }

      toast.success("Budget created successfully!");
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error(
        `Failed to create budget: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    setDialogOpen(false);
  };

  // Populate with test data
  const populateTestData = () => {
    // Sample team members
    const sampleTeamMembers: TeamMember[] = [
      {
        id: 1,
        name: "John Smith",
        role: "Frontend Developer",
        daily_cost: 450,
        wallet_address: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        role: "Backend Developer",
        daily_cost: 500,
        wallet_address: "0xabcdef1234567890abcdef1234567890abcdef12",
      },
      {
        id: 3,
        name: "Michael Chen",
        role: "UI/UX Designer",
        daily_cost: 400,
        wallet_address: "0x7890abcdef1234567890abcdef1234567890abcd",
      },
      {
        id: 4,
        name: "Emily Rodriguez",
        role: "Project Manager",
        daily_cost: 550,
        wallet_address: "0xdef1234567890abcdef1234567890abcdef123456",
      },
    ];

    // Keep existing services
    // const currentServices = [...thirdPartyServices];

    // Sample milestones
    const today = new Date();
    const sampleMilestones: Milestone[] = [
      {
        id: 1,
        name: "Project Setup & Planning",
        description:
          "Initial project setup, requirements gathering, and planning",
        dateRange: {
          from: today,
          to: addDays(today, 14),
        },
        teamMemberIds: [1, 4], // John and Emily
        serviceIds: [], // No services for this milestone
        deliverables: [
          {
            id: 1,
            name: "Project Plan Document",
            description:
              "Detailed project plan with timeline and resource allocation",
          },
          {
            id: 2,
            name: "Technical Architecture Document",
            description:
              "Overview of the technical architecture and technology stack",
          },
        ],
        isExpanded: true,
      },
      {
        id: 2,
        name: "Frontend Development",
        description:
          "Development of the user interface and frontend functionality",
        dateRange: {
          from: addDays(today, 15),
          to: addDays(today, 45),
        },
        teamMemberIds: [1, 3], // John and Michael
        serviceIds: [0], // First service
        deliverables: [
          {
            id: 3,
            name: "UI Components",
            description: "Reusable UI components based on the design system",
          },
          {
            id: 4,
            name: "Frontend Integration",
            description: "Integration with backend APIs",
          },
        ],
        isExpanded: true,
      },
      {
        id: 3,
        name: "Backend Development",
        description: "Development of the server-side functionality and APIs",
        dateRange: {
          from: addDays(today, 15),
          to: addDays(today, 60),
        },
        teamMemberIds: [2], // Sarah
        serviceIds: [], // No services for this milestone
        deliverables: [
          {
            id: 5,
            name: "API Documentation",
            description: "Documentation of all API endpoints and their usage",
          },
          {
            id: 6,
            name: "Database Schema",
            description: "Final database schema with relationships",
          },
        ],
        isExpanded: true,
      },
      {
        id: 4,
        name: "Testing & Deployment",
        description: "Quality assurance, testing, and production deployment",
        dateRange: {
          from: addDays(today, 61),
          to: addDays(today, 75),
        },
        teamMemberIds: [1, 2, 3, 4], // All team members
        serviceIds: [0], // First service
        deliverables: [
          {
            id: 7,
            name: "Test Reports",
            description: "Comprehensive test reports and bug fixes",
          },
          {
            id: 8,
            name: "Deployment Documentation",
            description:
              "Documentation of the deployment process and environment setup",
          },
        ],
        isExpanded: true,
      },
    ];

    // Update state with sample data
    setTeamMembers(sampleTeamMembers);
    setMilestones(sampleMilestones);
    // We're not updating services as per the request
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget Breakdown</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <InfoIcon className="h-4 w-4 mr-1" />
            <span>All costs are in USD</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Team Members</h3>
              <div className="ml-2 text-sm text-muted-foreground">
                (Required for budget calculation)
              </div>
            </div>
            <TeamMemberForm
              teamMembers={teamMembers}
              onChange={setTeamMembers}
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Third Party Services</h3>
              <div className="ml-2 text-sm text-muted-foreground">
                (Required for budget calculation)
              </div>
            </div>
            <ThirdPartyServiceForm
              thirdPartyServices={thirdPartyServices}
              onChange={setThirdPartyServices}
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Project Milestones</h3>
              <div className="ml-2 text-sm text-muted-foreground">
                (Track project progress and resource allocation)
              </div>
            </div>
            <MilestoneForm
              milestones={milestones}
              teamMembers={teamMembers}
              thirdPartyServices={thirdPartyServices}
              onChange={setMilestones}
            />
          </div>

          {/* Budget Summary Section */}
          <div className="border-t pt-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Budget Summary</h3>
              <div className="ml-2 text-sm text-muted-foreground">
                (Total project cost)
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-md space-y-2">
              <div className="flex justify-between">
                <span>Team Members Cost:</span>
                <span className="font-medium">
                  $
                  {budgetSummary.teamCost.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Third Party Services Cost:</span>
                <span className="font-medium">
                  $
                  {budgetSummary.serviceCost.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between">
                <span className="font-bold">Total Budget:</span>
                <span className="font-bold text-primary">
                  $
                  {budgetSummary.totalBudget.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={populateTestData}
                    variant="outline"
                    className="px-6"
                  >
                    Populate Test Data
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fill with sample team members and milestones</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button onClick={() => setDialogOpen(true)} className="px-6">
              Create Budget
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Budget Confirmation</DialogTitle>
            <DialogDescription>
              Review your budget breakdown before finalizing
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-2">
              {/* Team Members Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Team Members</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="bg-muted/30 p-3 rounded-md">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Name:
                          </span>
                          <p className="font-medium">
                            {member.name || "Unnamed"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Role:
                          </span>
                          <p className="font-medium">
                            {member.role || "Unspecified"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Daily Cost:
                          </span>
                          <p className="font-medium">
                            $
                            {member.daily_cost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        {member.wallet_address && (
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Wallet Address:
                            </span>
                            <p className="font-medium truncate">
                              {member.wallet_address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Third Party Services Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">
                  Third Party Services
                </h3>
                <div className="space-y-3">
                  {thirdPartyServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-muted/30 p-3 rounded-md"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Name:
                          </span>
                          <p className="font-medium">
                            {service.name || "Unnamed"}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Monthly Cost:
                          </span>
                          <p className="font-medium">
                            $
                            {service.monthly_cost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Project Milestones</h3>
                <div className="space-y-3">
                  {milestones.length === 0 ? (
                    <p className="text-muted-foreground">No milestones added</p>
                  ) : (
                    milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="bg-muted/30 p-3 rounded-md"
                      >
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">
                              Name:
                            </span>
                            <p className="font-medium">
                              {milestone.name || "Unnamed"}
                            </p>
                          </div>

                          {milestone.description && (
                            <div>
                              <span className="text-sm text-muted-foreground">
                                Description:
                              </span>
                              <p className="font-medium">
                                {milestone.description}
                              </p>
                            </div>
                          )}

                          <div>
                            <span className="text-sm text-muted-foreground">
                              Date Range:
                            </span>
                            <p className="font-medium">
                              {milestone.dateRange?.from &&
                              milestone.dateRange?.to
                                ? `${format(
                                    new Date(milestone.dateRange.from),
                                    "MMM d, yyyy"
                                  )} - ${format(
                                    new Date(milestone.dateRange.to),
                                    "MMM d, yyyy"
                                  )}`
                                : "No date range specified"}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm text-muted-foreground">
                              Team Members:
                            </span>
                            {milestone.teamMemberIds.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {milestone.teamMemberIds.map((id) => {
                                  const member = teamMembers.find(
                                    (m) => m.id === id
                                  );
                                  return member ? (
                                    <li key={id} className="font-medium">
                                      {member.name || "Unnamed"} (
                                      {member.role || "Unspecified"})
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            ) : (
                              <p className="font-medium">
                                No team members assigned
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-sm text-muted-foreground">
                              Services:
                            </span>
                            {milestone.serviceIds.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {milestone.serviceIds.map((id) => {
                                  const service = thirdPartyServices.find(
                                    (s) => s.id === id
                                  );
                                  return service ? (
                                    <li key={id} className="font-medium">
                                      {service.name || "Unnamed"}
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            ) : (
                              <p className="font-medium">
                                No services assigned
                              </p>
                            )}
                          </div>

                          {milestone.deliverables.length > 0 && (
                            <div>
                              <span className="text-sm text-muted-foreground">
                                Deliverables:
                              </span>
                              <ul className="list-disc list-inside">
                                {milestone.deliverables.map((deliverable) => (
                                  <li
                                    key={deliverable.id}
                                    className="font-medium"
                                  >
                                    {deliverable.name || "Unnamed"}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Budget Summary Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Budget Summary</h3>
                <div className="bg-muted/30 p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span>Team Members Cost:</span>
                    <span className="font-medium">
                      $
                      {budgetSummary.teamCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Third Party Services Cost:</span>
                    <span className="font-medium">
                      $
                      {budgetSummary.serviceCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="font-bold">Total Budget:</span>
                    <span className="font-bold text-primary">
                      $
                      {budgetSummary.totalBudget.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateBudget}>Create Budget</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BudgetBreakdown;
