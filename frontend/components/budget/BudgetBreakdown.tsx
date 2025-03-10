import { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamMemberForm, { TeamMember } from "./TeamMemberForm";
import ThirdPartyServiceForm, {
  ThirdPartyService,
} from "./ThirdPartyServiceForm";
import MilestoneForm, { Milestone } from "./MilestoneForm";
import { InfoIcon } from "lucide-react";

const BudgetBreakdown: FC = () => {
  // Initialize with one empty team member
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 0,
      name: "",
      role: "",
      dailyCost: 0,
      walletAddress: "",
    },
  ]);

  // Initialize with one empty third party service
  const [thirdPartyServices, setThirdPartyServices] = useState<
    ThirdPartyService[]
  >([
    {
      id: 0,
      name: "",
      monthlyCost: 0,
    },
  ]);

  // Initialize with empty milestones array
  const [milestones, setMilestones] = useState<Milestone[]>([]);

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
        <div>
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-medium">Team Members</h3>
            <div className="ml-2 text-sm text-muted-foreground">
              (Required for budget calculation)
            </div>
          </div>
          <TeamMemberForm teamMembers={teamMembers} onChange={setTeamMembers} />
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
      </CardContent>
    </Card>
  );
};

export default BudgetBreakdown;
