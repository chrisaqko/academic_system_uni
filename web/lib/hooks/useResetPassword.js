import { useState } from "react";
import { AuthService } from "@/lib/services/auth.service";

/**
 * Custom hook to manage the business logic and state of the password reset flow.
 * Inverts dependencies by consuming AuthService and exposing a clean API to UI components.
 */
export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const requestReset = async (email, redirectTo) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await AuthService.resetPasswordForEmail(email, redirectTo);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "An error occurred while requesting the password reset.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await AuthService.updatePassword(newPassword);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "An error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    requestReset,
    updatePassword,
    resetState,
  };
}
