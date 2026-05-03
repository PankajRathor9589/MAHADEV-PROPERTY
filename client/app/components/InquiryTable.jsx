import { MapPin, MessageSquareMore, Phone } from "lucide-react";
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
  new: "border-amber-200 bg-amber-50 text-amber-700",
  contacted: "border-sky-200 bg-sky-50 text-sky-700",
  closed: "border-emerald-200 bg-emerald-50 text-emerald-700"
};

const InquiryTable = ({ inquiries, editable = false, onStatusChange }) => {
  if (!inquiries.length) {
    return (
      <div className="rounded-[26px] border border-dashed border-[#e0d4c3] bg-[#fbf8f1] p-8 text-center text-sm text-ink-500">
        No leads yet.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 md:hidden">
        {inquiries.map((inquiry) => (
          <article key={inquiry._id} className="rounded-[28px] border border-[#eadfcf] bg-white p-4 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
            <div className="flex flex-wrap gap-2">
              <span className="badge border border-[#e8dcc8] bg-[#faf5ec] text-ink-700">
                <MessageSquareMore size={12} className="text-gold-600" />
                {sourceLabels[inquiry.source] || "Lead"}
              </span>
              <span className={`badge border ${statusStyles[inquiry.status] || "border-[#e8dcc8] bg-[#faf5ec] text-ink-700"}`}>
                {inquiry.status}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-ink-500">
              <div>
                <p className="font-semibold text-ink-900">{inquiry.name}</p>
                <p className="mt-1 inline-flex items-center gap-2">
                  <Phone size={13} className="text-gold-600" />
                  {inquiry.phone}
                </p>
                {inquiry.email ? <p className="mt-1 text-ink-400">{inquiry.email}</p> : null}
              </div>
              <div className="rounded-[20px] border border-[#ece2d4] bg-[#fbf8f2] p-3">
                <p>{inquiry.message || "No requirement shared."}</p>
                {inquiry.location ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-ink-400">
                    <MapPin size={13} className="text-gold-600" />
                    {inquiry.location}
                  </p>
                ) : null}
              </div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink-400">Created {formatDate(inquiry.createdAt)}</p>
              {editable ? (
                <select
                  className="input-field"
                  value={inquiry.status}
                  onChange={(event) => onStatusChange?.(inquiry._id, event.target.value)}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-[28px] border border-[#eadfcf] bg-white md:block">
        <table className="min-w-full text-left text-sm text-ink-700">
          <thead className="bg-[#faf6ef] text-ink-500">
            <tr>
              <th className="px-4 py-4 font-semibold">Source</th>
              <th className="px-4 py-4 font-semibold">Lead</th>
              <th className="px-4 py-4 font-semibold">Requirement</th>
              <th className="px-4 py-4 font-semibold">Property</th>
              <th className="px-4 py-4 font-semibold">Created</th>
              <th className="px-4 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="border-t border-[#efe5d9] align-top">
                <td className="px-4 py-4">
                  <span className="badge border border-[#e8dcc8] bg-[#faf5ec] text-ink-700">
                    {sourceLabels[inquiry.source] || "Lead"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold text-ink-900">{inquiry.name}</p>
                  <p className="mt-1 text-xs text-ink-500">{inquiry.phone}</p>
                  {inquiry.email ? <p className="text-xs text-ink-400">{inquiry.email}</p> : null}
                </td>
                <td className="px-4 py-4 text-ink-600">
                  <p>{inquiry.message || "No requirement shared."}</p>
                  {inquiry.serviceType ? <p className="mt-2 text-xs font-semibold text-gold-700">{inquiry.serviceType}</p> : null}
                  {inquiry.location ? <p className="mt-1 text-xs text-ink-400">{inquiry.location}</p> : null}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-ink-900">{inquiry.property?.title || inquiry.serviceType || "General enquiry"}</p>
                  {inquiry.property?.location?.city ? <p className="mt-1 text-xs text-ink-400">{inquiry.property.location.city}</p> : null}
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
                    <span className={`badge border ${statusStyles[inquiry.status] || "border-[#e8dcc8] bg-[#faf5ec] text-ink-700"}`}>
                      {inquiry.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InquiryTable;
