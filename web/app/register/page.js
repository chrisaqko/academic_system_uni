"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  User,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// ─── Field helpers ───────────────────────────────────────────────

function Field({ label, id, children, required }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-slate-600 uppercase tracking-wide"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all";

const iconInputCls =
  "w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all";

// ─── Steps config ────────────────────────────────────────────────

const STEPS = ["Account", "Personal", "Contact"];

// ─── Main component ──────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState(0);

  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile fields
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [secondSurname, setSecondSurname] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ── step validation ──────────────────────────────────────────

  const validateStep = () => {
    if (step === 0) {
      if (!email) return "Email is required.";
      if (password.length < 8) return "Password must be at least 8 characters.";
      if (password !== confirmPw) return "Passwords do not match.";
    }
    if (step === 1) {
      if (!name.trim()) return "Name is required.";
      if (!surname.trim()) return "Last name is required.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => s - 1);
  };

  // ── submit ───────────────────────────────────────────────────

  const handleSignUp = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setLoading(true);

    // 1. Create auth user — trigger will insert a skeleton profiles row
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          surname: surname,
          second_surname: secondSurname,
          country_code: countryCode,
          phone_number: phoneNumber,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
  };

  // ── success screen ───────────────────────────────────────────

  if (success) {
    return (
      <Shell>
        <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} className="text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Account created!</h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Please check your email and confirm your address before signing in.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all shadow-soft"
          >
            Go to Sign in
          </Link>
        </div>
      </Shell>
    );
  }

  // ── form ─────────────────────────────────────────────────────

  return (
    <Shell>
      {/* Header */}
      <div className="text-center mb-8">
        <p className="sc-label mb-2">Academic Portal</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                i < step
                  ? "bg-teal-500 text-white"
                  : i === step
                    ? "bg-primary-600 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                i === step ? "text-slate-800" : "text-slate-400"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`h-px flex-1 ${i < step ? "bg-teal-300" : "bg-slate-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-6">
        <form
          onSubmit={
            step === STEPS.length - 1
              ? handleSignUp
              : (e) => {
                  e.preventDefault();
                  nextStep();
                }
          }
        >
          <div className="space-y-4 mb-6">
            {/* ── STEP 0: Account ─────────────────────────── */}
            {step === 0 && (
              <>
                <Field label="Email address" id="email" required>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@institution.edu"
                      className={iconInputCls}
                    />
                  </div>
                </Field>

                <Field label="Password" id="password" required>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
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
                </Field>

                <Field label="Confirm password" id="confirmPw" required>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="confirmPw"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </Field>
              </>
            )}

            {/* ── STEP 1: Personal info ─────────────────── */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="First name" id="name" required>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. María"
                        className={iconInputCls}
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Last name" id="surname" required>
                    <input
                      id="surname"
                      type="text"
                      required
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="e.g. González"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Second last name" id="secondSurname">
                    <input
                      id="secondSurname"
                      type="text"
                      value={secondSurname}
                      onChange={(e) => setSecondSurname(e.target.value)}
                      placeholder="Optional"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── STEP 2: Contact ─────────────────── */}
            {step === 2 && (
              <>
                <Field label="Phone number" id="phone">
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-24 px-2 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all appearance-none"
                    >
                      <option value="+502">🇬🇹 +502</option>
                      <option value="+503">🇸🇻 +503</option>
                      <option value="+504">🇭🇳 +504</option>
                      <option value="+505">🇳🇮 +505</option>
                      <option value="+506">🇨🇷 +506</option>
                      <option value="+507">🇵🇦 +507</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="555 000 0000"
                        className={iconInputCls}
                      />
                    </div>
                  </div>
                </Field>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <ChevronLeft size={15} /> Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-soft"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account…
                </>
              ) : step < STEPS.length - 1 ? (
                <>
                  Continue <ChevronRight size={15} />
                </>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom link */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary-600 font-semibold hover:underline"
        >
          Sign in here
        </Link>
      </p>
    </Shell>
  );
}

// ── Shell layout ─────────────────────────────────────────────────

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-primary-50/30 flex flex-col">
      <header className="px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
          <GraduationCap size={16} className="text-white" />
        </div>
        <span className="font-bold text-slate-900">Scholastic Curator</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-300">
        © 2024 The Scholastic Curator. All institutional rights reserved.
      </footer>
    </div>
  );
}
