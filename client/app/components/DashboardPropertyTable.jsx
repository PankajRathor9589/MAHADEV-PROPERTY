import { Check, Clapperboard, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { resolveImageUrl } from "../services/api.js";
import {
  formatCurrency,
  formatDate,
  formatLocation,
  getPropertyCoverImage,
  hasPropertyVideo,
  isFeaturedProperty
} from "../utils/format.js";

const statusStyles = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700"
};

const ActionButtons = ({ property, onEdit, onDelete, onApprove, onReject, onToggleFeatured, loadingId }) => (
  <div className="flex flex-wrap gap-2">
    {onEdit ? (
      <button type="button" className="btn-secondary min-h-[42px] px-4" onClick={() => onEdit(property)} disabled={loadingId === property._id}>
        <Pencil size={16} />
        Edit
      </button>
    ) : null}

    {onApprove && property.approvalStatus !== "approved" ? (
      <button
        type="button"
        className="btn-secondary min-h-[42px] px-4"
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
        className="btn-secondary min-h-[42px] px-4"
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
        className="btn-secondary min-h-[42px] px-4"
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
        className="btn-danger min-h-[42px] px-4"
        onClick={() => onDelete(property._id)}
        disabled={loadingId === property._id}
      >
        <Trash2 size={16} />
        Delete
      </button>
    ) : null}
  </div>
);

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
      <div className="rounded-[26px] border border-dashed border-[#e0d4c3] bg-[#fbf8f1] p-8 text-center text-sm text-ink-500">
        No properties available yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {properties.map((property) => (
          <article key={property._id} className="rounded-[28px] border border-[#eadfcf] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <div className="flex gap-4">
              <img
                src={resolveImageUrl(getPropertyCoverImage(property), { width: 320, height: 240, crop: "fill" })}
                alt={property.title}
                className="h-24 w-24 rounded-[20px] object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-ink-900">{property.title}</p>
                <p className="mt-1 text-sm text-ink-500">{formatLocation(property.location, true)}</p>
                <p className="mt-2 text-sm font-semibold text-gold-700">{formatCurrency(property.price)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`badge border ${statusStyles[property.approvalStatus] || "border-[#e8dcc8] bg-[#faf5ec] text-ink-700"}`}>
                    {property.approvalStatus}
                  </span>
                  {isFeaturedProperty(property) ? (
                    <span className="badge border-gold-300 bg-[#f7ecd7] text-gold-700">Featured</span>
                  ) : null}
                  {hasPropertyVideo(property) ? (
                    <span className="badge border-[#e8dcc8] bg-[#faf5ec] text-ink-700">
                      <Clapperboard size={12} className="text-gold-600" />
                      Video
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            {property.rejectionReason ? <p className="mt-3 text-xs text-rose-600">Reason: {property.rejectionReason}</p> : null}
            <p className="mt-3 text-xs uppercase tracking-[0.18em] text-ink-400">Created {formatDate(property.createdAt)}</p>
            <div className="mt-4">
              <ActionButtons
                property={property}
                onEdit={onEdit}
                onDelete={onDelete}
                onApprove={onApprove}
                onReject={onReject}
                onToggleFeatured={onToggleFeatured}
                loadingId={loadingId}
              />
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-[28px] border border-[#eadfcf] bg-white md:block">
        <table className="min-w-full text-left text-sm text-ink-700">
          <thead className="bg-[#faf6ef] text-ink-500">
            <tr>
              <th className="px-4 py-4 font-semibold">Property</th>
              <th className="px-4 py-4 font-semibold">Type</th>
              <th className="px-4 py-4 font-semibold">Price</th>
              <th className="px-4 py-4 font-semibold">Status</th>
              <th className="px-4 py-4 font-semibold">Created</th>
              <th className="px-4 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property._id} className="border-t border-[#efe5d9] align-top">
                <td className="px-4 py-4">
                  <div className="flex gap-4">
                    <img
                      src={resolveImageUrl(getPropertyCoverImage(property), { width: 320, height: 240, crop: "fill" })}
                      alt={property.title}
                      className="h-16 w-16 rounded-[18px] object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="font-semibold text-ink-900">{property.title}</p>
                      <p className="mt-1 text-xs text-ink-500">{formatLocation(property.location, true)}</p>
                      {property.rejectionReason ? <p className="mt-2 text-xs text-rose-600">Reason: {property.rejectionReason}</p> : null}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 capitalize text-ink-600">
                  {property.listingType} / {property.category}
                  {hasPropertyVideo(property) ? (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#e8dcc8] bg-[#faf5ec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-ink-600">
                      <Clapperboard size={12} className="text-gold-600" />
                      Video
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-4 font-semibold text-gold-700">{formatCurrency(property.price)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <span className={`badge border ${statusStyles[property.approvalStatus] || "border-[#e8dcc8] bg-[#faf5ec] text-ink-700"}`}>
                      {property.approvalStatus}
                    </span>
                    {isFeaturedProperty(property) ? (
                      <span className="badge border-gold-300 bg-[#f7ecd7] text-gold-700">Featured</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-4 text-ink-500">{formatDate(property.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="min-w-[280px]">
                    <ActionButtons
                      property={property}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onApprove={onApprove}
                      onReject={onReject}
                      onToggleFeatured={onToggleFeatured}
                      loadingId={loadingId}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardPropertyTable;
