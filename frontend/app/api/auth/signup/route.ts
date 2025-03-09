import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { address } = body;
  const addressLower = address.toLowerCase();

  // Try to find user in database
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("address", addressLower)
    .single();
  if (data) {
    return NextResponse.json({}, { status: 200 });
  }

  // Create user in database
  const userId = randomUUID();
  const { error: insertError } = await supabase
    .from("users")
    .insert({ auth_user_id: userId, address: addressLower });
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 401 });
  }

  // Create auth user
  const { error } = await supabase.auth.admin.createUser({
    id: userId,
    email: `${addressLower}-${process.env.NEXT_PUBLIC_ANONYMOUS_SUFFIX}`,
    password: process.env.NEXT_PUBLIC_ANONYMOUS_PASSWORD as string,
    email_confirm: true,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({}, { status: 200 });
}
