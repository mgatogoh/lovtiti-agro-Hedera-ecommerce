export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import ListingContentPage from "./ListingContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingContentPage />
    </Suspense>
  );
}
