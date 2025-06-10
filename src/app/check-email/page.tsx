import CheckEmailPage from "@/components/auth/CheckEmailPage"
import { Suspense } from "react";

export default function CheckEmailRoute() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <CheckEmailPage />
      </Suspense>
    </div>
  )
}
