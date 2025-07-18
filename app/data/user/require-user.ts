import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export async function requireUser(){
    const sesson = await auth.api.getSession({
        headers: await headers()
    })

    if(!sesson){
        return redirect("/login")
    }

    return sesson.user
}