export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import DebugUserContent from "./DebugUserContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebugUserContent />
    </Suspense>
  );
}
