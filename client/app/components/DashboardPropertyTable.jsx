import { Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { formatCurrency, formatDate, isFeaturedProperty } from "../utils/format.js";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-rose-100 text-rose-700"
};

const DashboardPropertyTable = ({
  properties,
  mode = "user",
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured,
  loadingId
}) => {
  if (!properties.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No properties available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-3 pr-4 font-semibold">Property</th>
            <th className="pb-3 pr-4 font-semibold">Type</th>
            <th className="pb-3 pr-4 font-semibold">Price</th>
            <th className="pb-3 pr-4 font-semibold">Status</th>
            <th className="pb-3 pr-4 font-semibold">Created</th>
            <th className="pb-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id} className="border-b border-slate-100 align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{property.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {property.location?.city}, {property.location?.state}
                </p>
                {property.rejectionReason ? (
                  <p className="mt-2 text-xs text-rose-600">Reason: {property.rejectionReason}</p>
                ) : null}
              </td>
              <td className="py-4 pr-4 capitalize text-slate-600">
                {property.listingType} / {property.category}
              </td>
              <td className="py-4 pr-4 font-semibold text-brand-700">
                {formatCurrency(property.price)}
              </td>
              <td className="py-4 pr-4">
                <div className="flex flex-col gap-2">
                  <span className={`badge ${statusStyles[property.approvalStatus] || "bg-slate-100 text-slate-700"}`}>
                    {property.approvalStatus}
                  </span>
                  {isFeaturedProperty(property) && (
                    <span className="badge bg-accent-100 text-accent-600">Featured</span>
                  )}
                </div>
              </td>
              <td className="py-4 pr-4 text-slate-500">{formatDate(property.createdAt)}</td>
              <td className="py-4">
                <div className="flex flex-wrap gap-2">
                  {mode === "user" ? (
                    <>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onEdit?.(property)}
                        disabled={loadingId === property._id}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onApprove?.(property._id)}
                        disabled={loadingId === property._id}
                      >
                        <Check size={16} />
                        Approve
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onReject?.(property._id)}
                        disabled={loadingId === property._id}
                      >
                        <X size={16} />
                        Reject
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => onToggleFeatured?.(property)}
                        disabled={loadingId === property._id}
                      >
                        <Sparkles size={16} />
                        {isFeaturedProperty(property) ? "Unfeature" : "Feature"}
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => onDelete?.(property._id)}
                        disabled={loadingId === property._id}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPropertyTable;
