import { useState, useEffect } from "react";
import { useResetPassword } from "@/lib/hooks/useResetPassword";
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RequestReset() {
  const [email, setEmail] = useState("");
  const { loading, error, success, requestReset } = useResetPassword();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    // Dynamically resolve the return URL
    const redirectTo = `${origin}/reset-password`;
    await requestReset(email, redirectTo);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 size={28} className="text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-500">
          We sent a password reset link to <span className="font-semibold">{email}</span>.
        </p>
        <div className="pt-4">
          <Link href="/login" className="inline-flex items-center text-primary-600 hover:underline text-sm font-semibold">
            <ArrowLeft size={16} className="mr-1.5" /> Back to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Reset your password</h1>
        <p className="text-sm text-slate-500">
          Enter your email address and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Email address
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-soft mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </button>

      <div className="text-center mt-6">
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center">
          <ArrowLeft size={14} className="mr-1.5" /> Back to log in
        </Link>
      </div>
    </form>
  );
}
