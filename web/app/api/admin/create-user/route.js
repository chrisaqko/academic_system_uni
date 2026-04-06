// app/api/admin/create-user/route.js
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      name,
      surname,
      second_surname,
      phone_number,
      country_code,
      id_status,
      id_study_program,
      id_specialization,
      user_type,
      id_address,
    } = body;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // Update the profile row instead of inserting in case a Supabase DB trigger
    // already created the row when the user was inserted into auth.users
    const { error: profileError } = await supabaseAdmin
      .from("profile")
      .update({
        user_type: user_type,
        name: name,
        surname: surname,
        second_surname: second_surname,
        country_code: country_code,
        phone_number: phone_number,
        id_status: id_status,
        email: email,
        id_study_program: id_study_program,
        id_specialization: id_specialization,
        id_address: id_address,
      })
      .eq("id_profile", authData.user.id);

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return NextResponse.json(
      { message: "Profile created correctly", user: authData.user },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
