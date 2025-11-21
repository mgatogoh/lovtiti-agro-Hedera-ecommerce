export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import SignupFormPage from "./SignupFormPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupFormPage />
    </Suspense>
  );
}
