// src/features/vendors/VendorForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const vendorSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  category: z.string().min(1, "Category is required"),
  gstNumber: z.string().min(15, "Valid GST number is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  country: z.string().optional(),
  status: z.enum(["Active", "Pending", "Blocked"]),
});

export default function VendorForm({ onSubmit, onCancel, initialData }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialData || { status: "Pending", country: "India" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Company Name *</label>
          <input {...register("companyName")} className="input-field" placeholder="Acme Corp Pvt Ltd" />
          {errors.companyName && <p className="text-danger-400 text-xs mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <label className="input-label">Category *</label>
          <select {...register("category")} className="input-field">
            <option value="">Select Category</option>
            <option value="Construction">Construction</option>
            <option value="IT">IT</option>
            <option value="Logistics">Logistics</option>
            <option value="Packaging">Packaging</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Raw Materials">Raw Materials</option>
          </select>
          {errors.category && <p className="text-danger-400 text-xs mt-1">{errors.category.message}</p>}
        </div>
      </div>

      <div>
        <label className="input-label">GST Number *</label>
        <input {...register("gstNumber")} className="input-field font-mono" placeholder="27AABCI5678B1Z0" />
        {errors.gstNumber && <p className="text-danger-400 text-xs mt-1">{errors.gstNumber.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Contact Person *</label>
          <input {...register("contactPerson")} className="input-field" placeholder="Rajesh Kumar" />
          {errors.contactPerson && <p className="text-danger-400 text-xs mt-1">{errors.contactPerson.message}</p>}
        </div>
        <div>
          <label className="input-label">Email *</label>
          <input {...register("email")} className="input-field" placeholder="contact@company.in" />
          {errors.email && <p className="text-danger-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="input-label">Phone *</label>
          <input {...register("phone")} className="input-field" placeholder="+91 98765 43210" />
          {errors.phone && <p className="text-danger-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="input-label">Status</label>
          <select {...register("status")} className="input-field">
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      <div>
        <label className="input-label">Address *</label>
        <textarea {...register("address")} rows="2" className="input-field" placeholder="Full address..." />
        {errors.address && <p className="text-danger-400 text-xs mt-1">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : initialData ? "Update Vendor" : "Add Vendor"}
        </button>
      </div>
    </form>
  );
}
