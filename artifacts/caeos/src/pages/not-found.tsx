import { Link } from "wouter";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <Shield className="h-16 w-16 text-[#0ea5e9] mx-auto mb-6" />
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-slate-300 mb-8">
          Page not found — Constitutional protocol prevents navigation to undefined paths.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#2563eb] px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
