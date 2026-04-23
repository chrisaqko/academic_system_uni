import { supabase } from "@/lib/supabase/client";

/**
 * AuthService handles direct communication with the Supabase authentication API.
 * Adheres to the Single Responsibility Principle by encapsulating all remote auth calls.
 */
export const AuthService = {
  /**
   * Requests a password reset email for the given email address.
   * @param {string} email - The user's email address
   * @param {string} redirectTo - The URL to redirect to from the email
   * @returns {Promise<any>}
   */
  async resetPasswordForEmail(email, redirectTo) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Updates the user's password once they have successfully recovered their session.
   * @param {string} newPassword - The new password
   * @returns {Promise<any>}
   */
  async updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },
};
