import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-screen min-h-screen grid place-items-center">
      {children}
    </div>
  );
}
