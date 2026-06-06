import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { rfqSchema } from "../../utils/schemas";
import { Plus, X, Upload } from "lucide-react";
import StepIndicator from "../../components/StepIndicator";
import { rfqService } from "./rfqService";
import { vendorService } from "../vendors/vendorService";

export default function RFQCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);

  useEffect(() => {
    vendorService.getAll({ status: 'ACTIVE' }).then(res => setVendorsList(res.data?.items || []));
  }, []);

  const { register, control, handleSubmit, formState: { errors }, trigger, getValues } = useForm({
    resolver: zodResolver(rfqSchema),
    defaultValues: { lineItems: [{ item: "", quantity: 1, unit: "NOS" }], assignedVendors: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lineItems" });

  const steps = [
    { label: "RFQ Details", status: step > 1 ? "completed" : step === 1 ? "active" : "pending" },
    { label: "Items & Vendors", status: step > 2 ? "completed" : step === 2 ? "active" : "pending" },
    { label: "Review & Submit", status: step === 3 ? "active" : "pending" },
  ];

  const nextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["title", "category", "deadline"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["lineItems"]);
      if (valid) setStep(3);
    }
  };

  const toggleVendor = (vendor) => {
    setSelectedVendors((prev) =>
      prev.find((v) => v.id === vendor.id)
        ? prev.filter((v) => v.id !== vendor.id)
        : [...prev, vendor]
    );
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        category: data.category,
        deadline: new Date(data.deadline).toISOString(),
        description: data.description,
        items: data.lineItems.map(item => ({
          item_name: item.item,
          quantity: item.quantity,
          unit: item.unit
        })),
        vendors: selectedVendors.map(v => v.id)
      };
      await rfqService.create(payload);
      navigate("/rfqs");
    } catch (error) {
      console.error("Failed to create RFQ", error);
    }
  };

  const values = getValues();

  return (
    <div className="page-container max-w-5xl mx-auto">
      <div>
        <h1 className="page-title">Create RFQ</h1>
        <p className="page-subtitle">New request for quotation</p>
      </div>

      <StepIndicator steps={steps} currentStep={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        {/* Step 1: RFQ Details */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="input-label">RFQ Title *</label>
              <input {...register("title")} className="input-field" placeholder="Office Furniture Procurement Q2" />
              {errors.title && <p className="text-danger-400 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="input-label">Category *</label>
                <select {...register("category")} className="input-field">
                  <option value="">Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="IT Hardware">IT Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Electronics">Electronics</option>
                </select>
                {errors.category && <p className="text-danger-400 text-xs mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <label className="input-label">Deadline *</label>
                <input type="date" {...register("deadline")} className="input-field" />
                {errors.deadline && <p className="text-danger-400 text-xs mt-1">{errors.deadline.message}</p>}
              </div>
            </div>
            <div>
              <label className="input-label">Description</label>
              <textarea {...register("description")} rows="3" className="input-field" placeholder="Describe your procurement requirements..." />
            </div>
          </div>
        )}

        {/* Step 2: Line Items & Vendors */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">Line Items</h3>
                <button type="button" onClick={() => append({ item: "", quantity: 1, unit: "NOS" })} className="btn-ghost text-primary-400 text-xs inline-flex items-center gap-1">
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="table-header">Item</th>
                      <th className="table-header w-24">Qty</th>
                      <th className="table-header w-28">Unit</th>
                      <th className="table-header w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr key={field.id} className="border-b border-border/50">
                        <td className="py-2 pr-2">
                          <input {...register(`lineItems.${index}.item`)} className="input-field" placeholder="Item name" />
                        </td>
                        <td className="py-2 pr-2">
                          <input type="number" {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })} className="input-field" />
                        </td>
                        <td className="py-2 pr-2">
                          <select {...register(`lineItems.${index}.unit`)} className="input-field">
                            <option value="NOS">NOS</option>
                            <option value="SET">SET</option>
                            <option value="KG">KG</option>
                            <option value="ROLL">ROLL</option>
                            <option value="REAM">REAM</option>
                          </select>
                        </td>
                        <td className="py-2">
                          {fields.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="p-1.5 text-danger-400 hover:bg-danger-500/10 rounded">
                              <X size={14} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {errors.lineItems && <p className="text-danger-400 text-xs mt-2">At least one line item is required</p>}
            </div>

            {/* Vendor Assignment */}
            <div>
              <h3 className="text-base font-semibold text-white mb-3">Assign Vendors</h3>
              <div className="space-y-2">
                {selectedVendors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between px-4 py-2.5 bg-surfaceHighlight rounded-lg border border-border">
                    <span className="text-sm text-textMain">{v.company_name}</span>
                    <button type="button" onClick={() => toggleVendor(v)} className="text-danger-400 hover:text-danger-300">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="relative">
                  <select
                    onChange={(e) => {
                      const vendor = vendorsList.find((v) => v.id === e.target.value);
                      if (vendor) toggleVendor(vendor);
                      e.target.value = "";
                    }}
                    className="input-field"
                  >
                    <option value="">+ Add vendor</option>
                    {vendorsList.filter((v) => !selectedVendors.find((sv) => sv.id === v.id)).map((v) => (
                      <option key={v.id} value={v.id}>{v.company_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-semibold text-white">Review RFQ</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-textDim">Title:</span> <span className="text-textMain ml-2">{values.title}</span></div>
              <div><span className="text-textDim">Category:</span> <span className="text-textMain ml-2">{values.category}</span></div>
              <div><span className="text-textDim">Deadline:</span> <span className="text-textMain ml-2">{values.deadline}</span></div>
              <div><span className="text-textDim">Vendors:</span> <span className="text-textMain ml-2">{selectedVendors.length} assigned</span></div>
            </div>
            {values.description && <div className="text-sm"><span className="text-textDim">Description:</span><p className="text-textMuted mt-1">{values.description}</p></div>}

            <div>
              <h4 className="text-sm font-medium text-textMuted mb-2">Line Items ({values.lineItems?.length || 0})</h4>
              <div className="bg-background rounded-lg border border-border p-3 space-y-1">
                {values.lineItems?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-textMain">{item.item || "Unnamed"}</span>
                    <span className="text-textMuted">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments placeholder */}
            <div>
              <h4 className="text-sm font-medium text-textMuted mb-2">Attachments</h4>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary-500/30 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-textDim mb-2" />
                <p className="text-sm text-textMuted">Drag & drop files or click to upload</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6 mt-6 border-t border-border">
          <div>
            {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary">Back</button>}
          </div>
          <div className="flex gap-3">
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary">Continue</button>
            ) : (
              <>
                <button type="submit" className="btn-secondary">Save as Draft</button>
                <button type="submit" className="btn-primary">Save & Send to Vendors</button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
