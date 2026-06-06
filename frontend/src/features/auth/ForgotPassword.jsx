// src/features/auth/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { authService } from "./authService";
import { useState } from "react";
import { KeyRound, ArrowLeft, CheckCircle } from "lucide-react";

const schema = z.object({ email: z.string().email("Invalid email address") });

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-surface/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500/10 border border-primary-500/20 rounded-xl mx-auto flex items-center justify-center mb-4">
            {sent ? <CheckCircle size={24} className="text-success-400" /> : <KeyRound size={24} className="text-primary-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white">{sent ? "Check Your Email" : "Forgot Password"}</h2>
          <p className="text-textMuted text-sm mt-2">
            {sent ? "We've sent a password reset link to your email address." : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm rounded-lg text-center">{error}</div>
        )}

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">Email</label>
              <input {...register("email")} className="input-field" placeholder="your@email.com" />
              {errors.email && <p className="text-danger-400 text-xs mt-1.5">{errors.email.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <button onClick={() => setSent(false)} className="w-full btn-secondary py-3">Send Again</button>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
