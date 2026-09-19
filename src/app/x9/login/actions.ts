"use server";

import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

import { getSettings } from "../settings-actions";

export async function adminLogin(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const currentSettings = await getSettings();

  if (email === process.env.ADMIN_EMAIL && password === currentSettings.adminPassword) {
    // Generate JWT
    const alg = "HS256";
    const jwt = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET);

    const cookieStore = await cookies();
    cookieStore.set("src_admin_session", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("src_admin_session");
}
