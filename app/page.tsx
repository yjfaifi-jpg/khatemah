import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-400">جارٍ التحميل...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
