import { auth } from "@clerk/nextjs/server";

export async function requireUser(){
    const {userId} = await auth.protect();

    return userId;
}