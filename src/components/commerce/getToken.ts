'use server';
import { getAuthTokenFromCookies } from "@/lib/vendure/server/auth";
import { cookies } from "next/headers";

export async function getToken() {
    const cookieStore = await cookies();
    const token = getAuthTokenFromCookies(cookieStore);
    return token;
}