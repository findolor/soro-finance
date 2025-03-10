import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import {
  Milestone,
  TeamMember,
  ThirdPartyService,
  Deliverable,
} from "./BudgetBreakdown";

interface MilestoneFormProps {
  milestones: Milestone[];
  teamMembers: TeamMember[];
  thirdPartyServices: ThirdPartyService[];
  onChange: (milestones: Milestone[]) => void;
}

const MilestoneForm: FC<MilestoneFormProps> = ({
  milestones,
  teamMembers,
  thirdPartyServices,
  onChange,
}) => {
  // Set up form
  const form = useForm();

  // Generate a unique ID for new milestones
  const generateId = () => {
    return milestones.length > 0
      ? Math.max(...milestones.map((m) => m.id)) + 1
      : 0;
  };

  // Generate a unique ID for new deliverables
  const generateDeliverableId = (deliverables: Deliverable[]) => {
    return deliverables.length > 0
      ? Math.max(...deliverables.map((d) => d.id)) + 1
      : 0;
  };

  // Add a new empty milestone
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: generateId(),
      name: "",
      description: "",
      dateRange: undefined,
      teamMemberIds: [],
      serviceIds: [],
      deliverables: [],
      isExpanded: true,
    };
    onChange([...milestones, newMilestone]);
  };

  // Remove a milestone by ID
  const removeMilestone = (id: number) => {
    const updatedMilestones = milestones.filter(
      (milestone) => milestone.id !== id
    );
    onChange(updatedMilestones);
  };

  // Update a milestone's field
  const updateMilestone = (
    id: number,
    field: keyof Milestone,
    value:
      | string
      | number
      | number[]
      | boolean
      | { from: Date; to: Date }
      | undefined
      | Deliverable[]
      | null
  ) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === id) {
        return { ...milestone, [field]: value };
      }
      return milestone;
    });
    onChange(updatedMilestones);
  };

  // Add a new deliverable to a milestone
  const addDeliverable = (milestoneId: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const newDeliverable: Deliverable = {
      id: generateDeliverableId(milestone.deliverables),
      name: "",
      description: null,
    };

    const updatedDeliverables = [...milestone.deliverables, newDeliverable];
    updateMilestone(milestoneId, "deliverables", updatedDeliverables);
  };

  // Remove a deliverable from a milestone
  const removeDeliverable = (milestoneId: number, deliverableId: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const updatedDeliverables = milestone.deliverables.filter(
      (d) => d.id !== deliverableId
    );
    updateMilestone(milestoneId, "deliverables", updatedDeliverables);
  };

  // Update a deliverable's field
  const updateDeliverable = (
    milestoneId: number,
    deliverableId: number,
    field: keyof Deliverable,
    value: string | null
  ) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const updatedDeliverables = milestone.deliverables.map((deliverable) => {
      if (deliverable.id === deliverableId) {
        return { ...deliverable, [field]: value };
      }
      return deliverable;
    });

    updateMilestone(milestoneId, "deliverables", updatedDeliverables);
  };

  // Toggle team member selection
  const toggleTeamMember = (milestoneId: number, teamMemberId: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const teamMemberIds = [...milestone.teamMemberIds];
    const index = teamMemberIds.indexOf(teamMemberId);

    if (index === -1) {
      teamMemberIds.push(teamMemberId);
    } else {
      teamMemberIds.splice(index, 1);
    }

    updateMilestone(milestoneId, "teamMemberIds", teamMemberIds);
  };

  // Toggle service selection
  const toggleService = (milestoneId: number, serviceId: number) => {
    const milestone = milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const serviceIds = [...milestone.serviceIds];
    const index = serviceIds.indexOf(serviceId);

    if (index === -1) {
      serviceIds.push(serviceId);
    } else {
      serviceIds.splice(index, 1);
    }

    updateMilestone(milestoneId, "serviceIds", serviceIds);
  };

  // Toggle milestone expansion
  const toggleExpansion = (id: number) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone.id === id) {
        return { ...milestone, isExpanded: !milestone.isExpanded };
      }
      return milestone;
    });
    onChange(updatedMilestones);
  };

  // Handle date range change
  const handleDateRangeChange = (
    milestoneId: number,
    dateRange: DateRange | undefined
  ) => {
    if (dateRange?.from && dateRange?.to) {
      updateMilestone(milestoneId, "dateRange", {
        from: dateRange.from,
        to: dateRange.to,
      });
    } else {
      updateMilestone(milestoneId, "dateRange", undefined);
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {milestones.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">
              No milestones added yet
            </p>
            <Button onClick={addMilestone}>
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="border rounded-md bg-card overflow-hidden"
                >
                  {/* Milestone Header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer bg-muted/30"
                    onClick={() => toggleExpansion(milestone.id)}
                  >
                    <div className="flex items-center gap-2">
                      {milestone.isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h4 className="font-medium">
                        {milestone.name || "Untitled Milestone"}
                      </h4>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMilestone(milestone.id);
                      }}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Milestone Content */}
                  <div
                    className={cn(
                      "p-4 space-y-4",
                      milestone.isExpanded ? "block" : "hidden"
                    )}
                  >
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4">
                      <FormItem>
                        <FormLabel htmlFor={`name-${milestone.id}`}>
                          Milestone Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={`name-${milestone.id}`}
                            value={milestone.name}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Milestone name"
                          />
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel htmlFor={`description-${milestone.id}`}>
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            id={`description-${milestone.id}`}
                            value={milestone.description || ""}
                            onChange={(e) =>
                              updateMilestone(
                                milestone.id,
                                "description",
                                e.target.value || null
                              )
                            }
                            placeholder="Milestone description"
                            className="min-h-[100px]"
                          />
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Date Range</FormLabel>
                        <DatePickerWithRange
                          date={
                            milestone.dateRange
                              ? {
                                  from: milestone.dateRange.from,
                                  to: milestone.dateRange.to,
                                }
                              : undefined
                          }
                          onDateChange={(dateRange) =>
                            handleDateRangeChange(milestone.id, dateRange)
                          }
                        />
                      </FormItem>
                    </div>

                    {/* Team Members */}
                    <div>
                      <FormLabel className="block mb-2">Team Members</FormLabel>
                      <div className="space-y-2 border rounded-md p-3">
                        {teamMembers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No team members available
                          </p>
                        ) : (
                          teamMembers.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`member-${milestone.id}-${member.id}`}
                                checked={milestone.teamMemberIds.includes(
                                  member.id
                                )}
                                onCheckedChange={() =>
                                  toggleTeamMember(milestone.id, member.id)
                                }
                              />
                              <label
                                htmlFor={`member-${milestone.id}-${member.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {member.name || "Unnamed"} (
                                {member.role || "Unspecified"})
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <FormLabel className="block mb-2">
                        Third Party Services
                      </FormLabel>
                      <div className="space-y-2 border rounded-md p-3">
                        {thirdPartyServices.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No services available
                          </p>
                        ) : (
                          thirdPartyServices.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`service-${milestone.id}-${service.id}`}
                                checked={milestone.serviceIds.includes(
                                  service.id
                                )}
                                onCheckedChange={() =>
                                  toggleService(milestone.id, service.id)
                                }
                              />
                              <label
                                htmlFor={`service-${milestone.id}-${service.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {service.name || "Unnamed"} ($
                                {service.monthly_cost}/month)
                              </label>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="mb-0">Deliverables</FormLabel>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addDeliverable(milestone.id)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {milestone.deliverables.length === 0 ? (
                          <p className="text-sm text-muted-foreground border rounded-md p-3">
                            No deliverables added yet
                          </p>
                        ) : (
                          milestone.deliverables.map((deliverable) => (
                            <div
                              key={deliverable.id}
                              className="grid grid-cols-1 gap-3 p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <FormItem className="flex-1 mb-0">
                                  <FormLabel
                                    htmlFor={`deliverable-name-${milestone.id}-${deliverable.id}`}
                                  >
                                    Deliverable Name
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      id={`deliverable-name-${milestone.id}-${deliverable.id}`}
                                      value={deliverable.name}
                                      onChange={(e) =>
                                        updateDeliverable(
                                          milestone.id,
                                          deliverable.id,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Deliverable name"
                                    />
                                  </FormControl>
                                </FormItem>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() =>
                                    removeDeliverable(
                                      milestone.id,
                                      deliverable.id
                                    )
                                  }
                                  className="h-8 w-8 self-end mb-[2px]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              <FormItem>
                                <FormLabel
                                  htmlFor={`deliverable-desc-${milestone.id}-${deliverable.id}`}
                                >
                                  Description
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    id={`deliverable-desc-${milestone.id}-${deliverable.id}`}
                                    value={deliverable.description || ""}
                                    onChange={(e) =>
                                      updateDeliverable(
                                        milestone.id,
                                        deliverable.id,
                                        "description",
                                        e.target.value || null
                                      )
                                    }
                                    placeholder="Deliverable description"
                                    className="min-h-[80px]"
                                  />
                                </FormControl>
                              </FormItem>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={addMilestone} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Milestone
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

export default MilestoneForm;
