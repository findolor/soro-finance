import { Database } from "../supabase/types";

/**
 * Database row types
 */
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];
export type DeliverableRow =
  Database["public"]["Tables"]["deliverables"]["Row"];
export type TeamMemberRow = Database["public"]["Tables"]["team_members"]["Row"];
export type ThirdPartyServiceRow =
  Database["public"]["Tables"]["third_party_services"]["Row"];
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type MilestoneServiceRow =
  Database["public"]["Tables"]["milestone_services"]["Row"];
export type MilestoneTeamMemberRow =
  Database["public"]["Tables"]["milestone_team_members"]["Row"];

/**
 * Database insert types
 */
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type MilestoneInsert =
  Database["public"]["Tables"]["milestones"]["Insert"];
export type DeliverableInsert =
  Database["public"]["Tables"]["deliverables"]["Insert"];
export type TeamMemberInsert =
  Database["public"]["Tables"]["team_members"]["Insert"];
export type ThirdPartyServiceInsert =
  Database["public"]["Tables"]["third_party_services"]["Insert"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type MilestoneServiceInsert =
  Database["public"]["Tables"]["milestone_services"]["Insert"];
export type MilestoneTeamMemberInsert =
  Database["public"]["Tables"]["milestone_team_members"]["Insert"];

/**
 * Database update types
 */
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
export type MilestoneUpdate =
  Database["public"]["Tables"]["milestones"]["Update"];
export type DeliverableUpdate =
  Database["public"]["Tables"]["deliverables"]["Update"];
export type TeamMemberUpdate =
  Database["public"]["Tables"]["team_members"]["Update"];
export type ThirdPartyServiceUpdate =
  Database["public"]["Tables"]["third_party_services"]["Update"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];
export type MilestoneServiceUpdate =
  Database["public"]["Tables"]["milestone_services"]["Update"];
export type MilestoneTeamMemberUpdate =
  Database["public"]["Tables"]["milestone_team_members"]["Update"];
