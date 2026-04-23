import { useState } from "react";
import { useResetPassword } from "@/lib/hooks/useResetPassword";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const { loading, error, success, updatePassword } = useResetPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 8) return;
    await updatePassword(password);
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 size={28} className="text-teal-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Password updated!</h2>
        <p className="text-sm text-slate-500">
          Your password has been changed successfully. You can now use it to log in.
        </p>
        <div className="pt-4">
          <Link href="/login" className="flex items-center justify-center w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-soft">
            Continue to log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Set new password</h1>
        <p className="text-sm text-slate-500">
          Please enter your new password below.
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          New Password
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
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
            Updating...
          </>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
}
