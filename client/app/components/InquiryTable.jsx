import { formatDate } from "../utils/format.js";

const sourceLabels = {
  property: "Property Inquiry",
  homepage: "Homepage Lead",
  book_visit: "Book Visit",
  contact: "Contact Request"
};

const statusStyles = {
  new: "bg-amber-500/12 text-amber-200",
  contacted: "bg-sky-500/12 text-sky-200",
  closed: "bg-emerald-500/12 text-emerald-200"
};

const InquiryTable = ({ inquiries, editable = false, onStatusChange }) => {
  if (!inquiries.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-white/60">
        No leads yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-white/50">
            <th className="pb-3 pr-4 font-semibold">Source</th>
            <th className="pb-3 pr-4 font-semibold">Lead</th>
            <th className="pb-3 pr-4 font-semibold">Requirement</th>
            <th className="pb-3 pr-4 font-semibold">Property</th>
            <th className="pb-3 pr-4 font-semibold">Created</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry._id} className="border-b border-white/8 align-top">
              <td className="py-4 pr-4">
                <span className="badge bg-white/8 text-white/75">
                  {sourceLabels[inquiry.source] || "Lead"}
                </span>
              </td>
              <td className="py-4 pr-4">
                <p className="font-semibold text-white">{inquiry.name}</p>
                <p className="mt-1 text-xs text-white/55">{inquiry.phone}</p>
                {inquiry.email ? <p className="text-xs text-white/50">{inquiry.email}</p> : null}
              </td>
              <td className="py-4 pr-4 text-white/65">{inquiry.message || "No requirement shared."}</td>
              <td className="py-4 pr-4">
                <p className="font-medium text-white">{inquiry.property?.title || "General enquiry"}</p>
                {inquiry.property?.location?.city ? (
                  <p className="mt-1 text-xs text-white/50">{inquiry.property.location.city}</p>
                ) : null}
              </td>
              <td className="py-4 pr-4 text-white/55">{formatDate(inquiry.createdAt)}</td>
              <td className="py-4">
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
                  <span className={`badge ${statusStyles[inquiry.status] || "bg-white/8 text-white/70"}`}>
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
