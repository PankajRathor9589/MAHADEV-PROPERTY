import { BadgeCheck, Pencil, ShieldCheck, ShieldX, Trash2 } from "lucide-react";

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString("en-IN")}`;

const DashboardPropertyTable = ({
  properties,
  onEdit,
  onDelete,
  onMarkSold,
  onApprove,
  onReject,
  loadingId = ""
}) => {
  if (properties.length === 0) {
    return <p className="text-sm text-slate-500">No properties found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Price</th>
            <th className="px-3 py-3">Location</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property._id} className="border-b border-slate-200 last:border-none">
              <td className="px-3 py-3 font-medium text-slate-800">{property.title}</td>
              <td className="px-3 py-3 text-slate-600">{property.propertyType}</td>
              <td className="px-3 py-3 text-slate-600">{formatCurrency(property.price)}</td>
              <td className="px-3 py-3 text-slate-600">
                {property.location?.locality}, {property.location?.city}
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      property.listingStatus === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : property.listingStatus === "rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {property.listingStatus}
                  </span>
                  {property.isSold && (
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                      sold
                    </span>
                  )}
                </div>
              </td>
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit?.(property)} className="btn-secondary">
                    <Pencil size={14} /> Edit
                  </button>

                  {!property.isSold && onMarkSold && (
                    <button
                      onClick={() => onMarkSold(property._id)}
                      className="btn-primary"
                      disabled={loadingId === property._id}
                    >
                      <BadgeCheck size={14} /> Sold
                    </button>
                  )}

                  {onApprove && property.listingStatus !== "approved" && (
                    <button
                      onClick={() => onApprove(property._id)}
                      className="btn-primary"
                      disabled={loadingId === property._id}
                    >
                      <ShieldCheck size={14} /> Approve
                    </button>
                  )}

                  {onReject && property.listingStatus !== "rejected" && (
                    <button
                      onClick={() => onReject(property._id)}
                      className="btn-secondary"
                      disabled={loadingId === property._id}
                    >
                      <ShieldX size={14} /> Reject
                    </button>
                  )}

                  <button
                    onClick={() => onDelete?.(property._id)}
                    className="btn-danger"
                    disabled={loadingId === property._id}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>

                {property.listingStatus === "rejected" && property.rejectedReason && (
                  <p className="mt-1 text-right text-xs text-rose-600">Reason: {property.rejectedReason}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPropertyTable;
