import { FC, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { format } from "date-fns";

// Import the types from the original components
import { TeamMember } from "./TeamMemberForm";
import { ThirdPartyService } from "./ThirdPartyServiceForm";
import { Milestone } from "./MilestoneForm";

interface BudgetBreakdownReadOnlyProps {
  // Optional props to allow passing data from parent component
  initialTeamMembers?: TeamMember[];
  initialServices?: ThirdPartyService[];
  initialMilestones?: Milestone[];
}

// Add interface for milestone cost calculation
interface MilestoneCost {
  teamCost: number;
  serviceCost: number;
  totalCost: number;
}

const BudgetBreakdownReadOnly: FC<BudgetBreakdownReadOnlyProps> = ({
  initialTeamMembers,
  initialServices,
  initialMilestones,
}) => {
  // State for budget data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    initialTeamMembers || []
  );
  const [thirdPartyServices, setThirdPartyServices] = useState<
    ThirdPartyService[]
  >(initialServices || []);
  const [milestones, setMilestones] = useState<Milestone[]>(
    initialMilestones || []
  );

  // Function to calculate cost for a single milestone
  const calculateMilestoneCost = (milestone: Milestone): MilestoneCost => {
    let teamCost = 0;
    let serviceCost = 0;

    if (!milestone.dateRange?.from || !milestone.dateRange?.to) {
      return { teamCost: 0, serviceCost: 0, totalCost: 0 };
    }

    const startDate = new Date(milestone.dateRange.from);
    const endDate = new Date(milestone.dateRange.to);
    const durationInDays =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1; // +1 to include both start and end days

    // Calculate team member costs for this milestone
    milestone.teamMemberIds.forEach((memberId) => {
      const member = teamMembers.find((m) => m.id === memberId);
      if (member) {
        teamCost += member.dailyCost * durationInDays;
      }
    });

    // Calculate service costs for this milestone
    const durationInMonths = Math.ceil(durationInDays / 30); // Approximate months

    milestone.serviceIds.forEach((serviceId) => {
      const service = thirdPartyServices.find((s) => s.id === serviceId);
      if (service) {
        serviceCost += service.monthlyCost * durationInMonths;
      }
    });

    const totalCost = teamCost + serviceCost;
    return { teamCost, serviceCost, totalCost };
  };

  // Calculate the total budget
  const budgetSummary = (() => {
    let totalTeamCost = 0;
    let totalServiceCost = 0;

    // Process each milestone
    milestones.forEach((milestone) => {
      const milestoneCost = calculateMilestoneCost(milestone);
      totalTeamCost += milestoneCost.teamCost;
      totalServiceCost += milestoneCost.serviceCost;
    });

    const totalBudget = totalTeamCost + totalServiceCost;

    return {
      teamCost: totalTeamCost,
      serviceCost: totalServiceCost,
      totalBudget: totalBudget,
    };
  })();

  // Load sample data if no data is provided
  useEffect(() => {
    if (
      (!initialTeamMembers || initialTeamMembers.length === 0) &&
      (!initialServices || initialServices.length === 0) &&
      (!initialMilestones || initialMilestones.length === 0)
    ) {
      populateTestData();
    }
  }, [initialTeamMembers, initialServices, initialMilestones]);

  // Populate with test data (same as in the original component)
  const populateTestData = () => {
    // Sample team members
    const sampleTeamMembers: TeamMember[] = [
      {
        id: 1,
        name: "John Smith",
        role: "Frontend Developer",
        dailyCost: 450,
        walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        role: "Backend Developer",
        dailyCost: 500,
        walletAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      },
      {
        id: 3,
        name: "Michael Chen",
        role: "UI/UX Designer",
        dailyCost: 400,
        walletAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
      },
      {
        id: 4,
        name: "Emily Rodriguez",
        role: "Project Manager",
        dailyCost: 550,
        walletAddress: "0xdef1234567890abcdef1234567890abcdef123456",
      },
    ];

    // Sample services
    const sampleServices: ThirdPartyService[] = [
      {
        id: 0,
        name: "AWS Hosting",
        monthlyCost: 200,
      },
      {
        id: 1,
        name: "Database Service",
        monthlyCost: 150,
      },
    ];

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
          to: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
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
          from: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
          to: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
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
          from: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000),
          to: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
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
          from: new Date(today.getTime() + 61 * 24 * 60 * 60 * 1000),
          to: new Date(today.getTime() + 75 * 24 * 60 * 60 * 1000),
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
    setThirdPartyServices(sampleServices);
    setMilestones(sampleMilestones);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Budget Breakdown</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <InfoIcon className="h-4 w-4 mr-1" />
          <span>All costs are in USD</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Team Members Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Team Members</h3>
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-muted-foreground">No team members added</p>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-muted/30 p-3 rounded-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  <div>
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <p className="font-medium">{member.name || "Unnamed"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Role:</span>
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
                      {member.dailyCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  {member.walletAddress && (
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Wallet Address:
                      </span>
                      <p className="font-medium truncate">
                        {member.walletAddress}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Third Party Services Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Third Party Services</h3>
          <div className="space-y-3">
            {thirdPartyServices.length === 0 ? (
              <p className="text-muted-foreground">No services added</p>
            ) : (
              thirdPartyServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-muted/30 p-3 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Service Name:
                    </span>
                    <p className="font-medium">{service.name || "Unnamed"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Monthly Cost:
                    </span>
                    <p className="font-medium">
                      $
                      {service.monthlyCost.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Milestones Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Project Milestones</h3>
          <div className="space-y-4">
            {milestones.length === 0 ? (
              <p className="text-muted-foreground">No milestones added</p>
            ) : (
              milestones.map((milestone) => {
                // Calculate the cost for this milestone
                const milestoneCost = calculateMilestoneCost(milestone);

                return (
                  <div
                    key={milestone.id}
                    className="bg-muted/30 p-4 rounded-md space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-base">
                          {milestone.name || "Unnamed Milestone"}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm mt-1">
                            {milestone.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          Total Cost:
                        </span>
                        <p className="font-medium text-primary">
                          $
                          {milestoneCost.totalCost.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">
                          Date Range:
                        </span>
                        <p className="font-medium">
                          {milestone.dateRange?.from && milestone.dateRange?.to
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <p className="font-medium">No services assigned</p>
                        )}
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground">
                          Deliverables:
                        </span>
                        {milestone.deliverables.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {milestone.deliverables.map((deliverable) => (
                              <li key={deliverable.id} className="font-medium">
                                {deliverable.name || "Unnamed"}
                                {deliverable.description && (
                                  <span className="font-normal text-sm ml-1">
                                    - {deliverable.description}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="font-medium">No deliverables added</p>
                        )}
                      </div>
                    </div>

                    {/* Milestone Cost Breakdown */}
                    <div className="mt-3 pt-3 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Team Cost:
                          </span>
                          <p className="font-medium">
                            $
                            {milestoneCost.teamCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Services Cost:
                          </span>
                          <p className="font-medium">
                            $
                            {milestoneCost.serviceCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">
                            Total Milestone Cost:
                          </span>
                          <p className="font-medium">
                            $
                            {milestoneCost.totalCost.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Budget Summary Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Budget Summary</h3>
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
      </CardContent>
    </Card>
  );
};

export default BudgetBreakdownReadOnly;
