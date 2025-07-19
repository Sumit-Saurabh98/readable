import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

export const requireUser = cache(async () => {
  const sesson = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sesson) {
    return redirect("/login");
  }

  return sesson.user;
});
