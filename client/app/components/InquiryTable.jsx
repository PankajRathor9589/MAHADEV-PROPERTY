import { formatDate } from "../utils/format.js";

const InquiryTable = ({ inquiries, editable = false, onStatusChange }) => {
  if (!inquiries.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No inquiries yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-3 pr-4 font-semibold">Property</th>
            <th className="pb-3 pr-4 font-semibold">Lead</th>
            <th className="pb-3 pr-4 font-semibold">Message</th>
            <th className="pb-3 pr-4 font-semibold">Created</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry._id} className="border-b border-slate-100 align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{inquiry.property?.title || "Property removed"}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {inquiry.property?.location?.city || "Unknown city"}
                </p>
              </td>
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{inquiry.name}</p>
                <p className="mt-1 text-xs text-slate-500">{inquiry.phone}</p>
                {inquiry.email ? <p className="text-xs text-slate-500">{inquiry.email}</p> : null}
              </td>
              <td className="py-4 pr-4 text-slate-600">{inquiry.message || "No message shared."}</td>
              <td className="py-4 pr-4 text-slate-500">{formatDate(inquiry.createdAt)}</td>
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
                  <span className="badge bg-slate-100 text-slate-700">{inquiry.status}</span>
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
