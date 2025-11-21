export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import CheckoutSuccessContent from "./CheckoutSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
