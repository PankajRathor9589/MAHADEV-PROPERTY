import { Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import {
  formatCurrency,
  formatDate,
  formatLocation,
  isFeaturedProperty
} from "../utils/format.js";

const statusStyles = {
  approved: "bg-emerald-500/12 text-emerald-200",
  pending: "bg-amber-500/12 text-amber-200",
  rejected: "bg-rose-500/12 text-rose-200"
};

const DashboardPropertyTable = ({
  properties,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onToggleFeatured,
  loadingId = ""
}) => {
  if (!properties.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-white/60">
        No properties available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/50">
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
            <tr key={property._id} className="border-b border-white/8 align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold text-white">{property.title}</p>
                <p className="mt-1 text-xs text-white/55">{formatLocation(property.location, true)}</p>
                {property.rejectionReason ? (
                  <p className="mt-2 text-xs text-rose-200">Reason: {property.rejectionReason}</p>
                ) : null}
              </td>
              <td className="py-4 pr-4 capitalize text-white/65">
                {property.listingType} / {property.category}
              </td>
              <td className="py-4 pr-4 font-semibold text-gold-200">{formatCurrency(property.price)}</td>
              <td className="py-4 pr-4">
                <div className="flex flex-col gap-2">
                  <span className={`badge ${statusStyles[property.approvalStatus] || "bg-white/8 text-white/70"}`}>
                    {property.approvalStatus}
                  </span>
                  {isFeaturedProperty(property) && (
                    <span className="badge bg-gold-300/15 text-gold-100">Featured</span>
                  )}
                </div>
              </td>
              <td className="py-4 pr-4 text-white/55">{formatDate(property.createdAt)}</td>
              <td className="py-4">
                <div className="flex flex-wrap gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onEdit(property)}
                      disabled={loadingId === property._id}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  )}

                  {onApprove && property.approvalStatus !== "approved" && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onApprove(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  )}

                  {onReject && property.approvalStatus !== "rejected" && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onReject(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <X size={16} />
                      Reject
                    </button>
                  )}

                  {onToggleFeatured && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onToggleFeatured(property)}
                      disabled={loadingId === property._id}
                    >
                      <Sparkles size={16} />
                      {isFeaturedProperty(property) ? "Unfeature" : "Feature"}
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => onDelete(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
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
