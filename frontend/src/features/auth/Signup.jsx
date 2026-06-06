// src/features/auth/Signup.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "./authService";
import { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["Vendor", "Officer", "Manager", "Admin"]),
  country: z.string().optional(),
  additionalInfo: z.string().optional(),
});

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "Vendor", country: "India" },
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      
      const roleMap = {
        "Vendor": "VENDOR",
        "Officer": "PROCUREMENT_OFFICER",
        "Manager": "MANAGER",
        "Admin": "ADMIN"
      };

      const payload = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        role: roleMap[data.role],
      };

      await authService.signup(payload);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full bg-surface/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-border relative z-10 animate-fade-in">
        {/* Avatar area */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/20 mb-3">
            <UserPlus size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-textMuted text-sm mt-1">Join VendorBridge ERP</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/20 text-danger-400 text-sm rounded-lg text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">First Name</label>
              <input {...register("firstName")} className="input-field" placeholder="John" />
              {errors.firstName && <p className="text-danger-400 text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="input-label">Last Name</label>
              <input {...register("lastName")} className="input-field" placeholder="Doe" />
              {errors.lastName && <p className="text-danger-400 text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Email Address</label>
              <input {...register("email")} className="input-field" placeholder="john@company.com" />
              {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="input-label">Phone Number</label>
              <input {...register("phone")} className="input-field" placeholder="+91 98765 43210" />
              {errors.phone && <p className="text-danger-400 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Role</label>
              <select {...register("role")} className="input-field">
                <option value="Vendor">Vendor</option>
                <option value="Officer">Procurement Officer</option>
                <option value="Manager">Manager / Approver</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="input-label">Country</label>
              <input {...register("country")} className="input-field" placeholder="India" />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} {...register("password")} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-textDim hover:text-textMuted">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-danger-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="input-label">Additional Information</label>
            <textarea {...register("additionalInfo")} rows="3" className="input-field" placeholder="Tell us about your company or role..." />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 mt-2">
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-textMuted">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
