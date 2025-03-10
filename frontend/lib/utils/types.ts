import { Database } from "../supabase/types";

/**
 * Database row types
 */
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];

/**
 * Database insert types
 */
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
