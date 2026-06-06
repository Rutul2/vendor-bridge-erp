// src/features/auth/Login.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { authService } from "./authService";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      // Mock login for hackathon demo
      login({ role: "Officer", name: "Demo Officer", email: data.email }, "fake-token", "fake-refresh");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-primary-400/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-md w-full bg-surface/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl mx-auto flex items-center justify-center font-bold text-white text-xl mb-4 shadow-lg shadow-primary-500/25">
            V
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-textMuted text-sm mt-2">Sign in to VendorBridge ERP</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm rounded-lg text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="input-label">Email</label>
            <input {...register("email")} className="input-field" placeholder="officer@company.com" />
            {errors.email && <p className="text-danger-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} {...register("password")} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textDim hover:text-textMuted transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-danger-400 text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 mt-2">
            {isSubmitting ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-primary-400 hover:text-primary-300 transition-colors">Forgot Password?</Link>
          <span className="text-textMuted">
            New here?{" "}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 transition-colors">Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
