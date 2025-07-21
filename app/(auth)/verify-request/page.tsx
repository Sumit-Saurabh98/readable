// app/(auth)/verify-request/page.tsx

'use client';

import { Suspense } from "react";
import { VerifyRequestInner } from "./_components/VerifyRequestInner";

export default function VerifyRequest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestInner />
    </Suspense>
  );
}
