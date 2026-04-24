import { formatDate } from "../utils/format.js";

const sourceLabels = {
  property: "Property Lead",
  homepage: "Homepage Lead",
  book_visit: "Site Visit",
  contact: "Contact Request",
  contract: "Contract Application",
  sell: "Sell Property"
};

const statusStyles = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-sky-50 text-sky-700",
  closed: "bg-emerald-50 text-emerald-700"
};

const InquiryTable = ({ inquiries, editable = false, onStatusChange }) => {
  if (!inquiries.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50 p-8 text-center text-sm text-ink-500">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-100">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-cream-100 text-ink-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Source</th>
            <th className="px-4 py-3 font-semibold">Lead</th>
            <th className="px-4 py-3 font-semibold">Requirement</th>
            <th className="px-4 py-3 font-semibold">Property</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry._id} className="border-t border-brand-100 align-top">
              <td className="px-4 py-4">
                <span className="badge bg-brand-50 text-brand-700">
                  {sourceLabels[inquiry.source] || "Lead"}
                </span>
              </td>
              <td className="px-4 py-4">
                <p className="font-semibold text-ink-800">{inquiry.name}</p>
                <p className="mt-1 text-xs text-ink-500">{inquiry.phone}</p>
                {inquiry.email ? <p className="text-xs text-ink-400">{inquiry.email}</p> : null}
              </td>
              <td className="px-4 py-4 text-ink-500">
                <p>{inquiry.message || "No requirement shared."}</p>
                {inquiry.serviceType ? (
                  <p className="mt-2 text-xs font-semibold text-brand-700">{inquiry.serviceType}</p>
                ) : null}
                {inquiry.location ? <p className="mt-1 text-xs text-ink-400">{inquiry.location}</p> : null}
              </td>
              <td className="px-4 py-4">
                <p className="font-medium text-ink-800">
                  {inquiry.property?.title || inquiry.serviceType || "General enquiry"}
                </p>
                {inquiry.property?.location?.city ? (
                  <p className="mt-1 text-xs text-ink-400">{inquiry.property.location.city}</p>
                ) : null}
              </td>
              <td className="px-4 py-4 text-ink-500">{formatDate(inquiry.createdAt)}</td>
              <td className="px-4 py-4">
                {editable ? (
                  <select
                    className="input-field min-w-[150px]"
                    value={inquiry.status}
                    onChange={(event) => onStatusChange?.(inquiry._id, event.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                ) : (
                  <span className={`badge ${statusStyles[inquiry.status] || "bg-brand-50 text-brand-700"}`}>
                    {inquiry.status}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryTable;
