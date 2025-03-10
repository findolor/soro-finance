import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { TeamMember } from "./BudgetBreakdown";

interface TeamMemberFormProps {
  teamMembers: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

const TeamMemberForm: FC<TeamMemberFormProps> = ({ teamMembers, onChange }) => {
  // Set up form
  const form = useForm();

  // Generate a unique ID for new team members
  const generateId = () => {
    return teamMembers.length > 0
      ? Math.max(...teamMembers.map((m) => m.id)) + 1
      : 0;
  };

  // Add a new empty team member
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: generateId(),
      name: "",
      role: "",
      daily_cost: 0,
      wallet_address: null,
    };
    onChange([...teamMembers, newMember]);
  };

  // Remove a team member by ID
  const removeTeamMember = (id: number) => {
    const updatedMembers = teamMembers.filter((member) => member.id !== id);
    onChange(updatedMembers);
  };

  // Update a team member's field
  const updateTeamMember = (
    id: number,
    field: keyof TeamMember,
    value: string | number | null
  ) => {
    const updatedMembers = teamMembers.map((member) => {
      if (member.id === id) {
        return { ...member, [field]: value };
      }
      return member;
    });
    onChange(updatedMembers);
  };

  return (
    <Form {...form}>
      <div className="space-y-4">
        {teamMembers.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">
              No team members added yet
            </p>
            <Button onClick={addTeamMember}>
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        ) : (
          <>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-md bg-card"
              >
                <FormItem>
                  <FormLabel htmlFor={`name-${member.id}`}>Name</FormLabel>
                  <FormControl>
                    <Input
                      id={`name-${member.id}`}
                      value={member.name}
                      onChange={(e) =>
                        updateTeamMember(member.id, "name", e.target.value)
                      }
                      placeholder="Team member name"
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor={`role-${member.id}`}>Role</FormLabel>
                  <FormControl>
                    <Input
                      id={`role-${member.id}`}
                      value={member.role}
                      onChange={(e) =>
                        updateTeamMember(member.id, "role", e.target.value)
                      }
                      placeholder="Team member role"
                    />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel htmlFor={`cost-${member.id}`}>
                    Daily Cost ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={`cost-${member.id}`}
                      type="number"
                      value={member.daily_cost || ""}
                      onChange={(e) =>
                        updateTeamMember(
                          member.id,
                          "daily_cost",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </FormControl>
                </FormItem>

                <div>
                  <FormItem>
                    <FormLabel htmlFor={`wallet-${member.id}`}>
                      Wallet Address (Optional)
                    </FormLabel>
                    <div className="flex">
                      <FormControl>
                        <Input
                          id={`wallet-${member.id}`}
                          value={member.wallet_address || ""}
                          onChange={(e) =>
                            updateTeamMember(
                              member.id,
                              "wallet_address",
                              e.target.value || null
                            )
                          }
                          placeholder="0x..."
                          className="flex-1"
                        />
                      </FormControl>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeTeamMember(member.id)}
                        className="ml-2"
                        disabled={teamMembers.length === 1}
                        title={
                          teamMembers.length === 1
                            ? "At least one team member is required"
                            : "Remove team member"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormItem>
                </div>
              </div>
            ))}
            <Button onClick={addTeamMember} variant="outline" className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Team Member
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

export default TeamMemberForm;
