import { Check, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { formatCurrency, formatDate, formatLocation, isFeaturedProperty } from "../utils/format.js";

const statusStyles = {
  approved: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  rejected: "bg-rose-50 text-rose-700"
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
      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-8 text-center text-sm text-ink-500">
        No properties available yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-cream-100 text-ink-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Property</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id} className="border-t border-brand-100 align-top">
              <td className="px-4 py-4">
                <p className="font-semibold text-ink-700">{property.title}</p>
                <p className="mt-1 text-xs text-ink-500">{formatLocation(property.location, true)}</p>
                {property.rejectionReason ? <p className="mt-2 text-xs text-rose-700">Reason: {property.rejectionReason}</p> : null}
              </td>
              <td className="px-4 py-4 capitalize text-ink-500">
                {property.listingType} / {property.category}
              </td>
              <td className="px-4 py-4 font-semibold text-brand-700">{formatCurrency(property.price)}</td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-2">
                  <span className={`badge ${statusStyles[property.approvalStatus] || "bg-brand-50 text-brand-700"}`}>
                    {property.approvalStatus}
                  </span>
                  {isFeaturedProperty(property) ? <span className="badge bg-[#f5e4bf] text-brand-700">Featured</span> : null}
                </div>
              </td>
              <td className="px-4 py-4 text-ink-500">{formatDate(property.createdAt)}</td>
              <td className="px-4 py-4">
                <div className="flex min-w-[260px] flex-wrap gap-2">
                  {onEdit ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onEdit(property)}
                      disabled={loadingId === property._id}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                  ) : null}

                  {onApprove && property.approvalStatus !== "approved" ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onApprove(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <Check size={16} />
                      Approve
                    </button>
                  ) : null}

                  {onReject && property.approvalStatus !== "rejected" ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onReject(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <X size={16} />
                      Reject
                    </button>
                  ) : null}

                  {onToggleFeatured ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => onToggleFeatured(property)}
                      disabled={loadingId === property._id}
                    >
                      <Sparkles size={16} />
                      {isFeaturedProperty(property) ? "Unfeature" : "Feature"}
                    </button>
                  ) : null}

                  {onDelete ? (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => onDelete(property._id)}
                      disabled={loadingId === property._id}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  ) : null}
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
