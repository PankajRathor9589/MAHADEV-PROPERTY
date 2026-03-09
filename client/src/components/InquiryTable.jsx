const InquiryTable = ({ inquiries, onStatusChange, editable = false }) => {
  if (!inquiries.length) {
    return <p className="text-sm text-slate-500">No inquiries found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3">Buyer</th>
            <th className="px-3 py-3">Phone</th>
            <th className="px-3 py-3">Property</th>
            <th className="px-3 py-3">Message</th>
            <th className="px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry._id} className="border-b border-slate-200 last:border-none">
              <td className="px-3 py-3 font-medium text-slate-800">{inquiry.buyerName}</td>
              <td className="px-3 py-3 text-slate-600">{inquiry.buyerPhone}</td>
              <td className="px-3 py-3 text-slate-600">{inquiry.property?.title || "N/A"}</td>
              <td className="px-3 py-3 text-slate-600">{inquiry.message || "-"}</td>
              <td className="px-3 py-3">
                {editable ? (
                  <select
                    className="input-field"
                    value={inquiry.status}
                    onChange={(event) => onStatusChange(inquiry._id, event.target.value)}
                  >
                    <option value="new">new</option>
                    <option value="contacted">contacted</option>
                    <option value="closed">closed</option>
                  </select>
                ) : (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      inquiry.status === "new"
                        ? "bg-amber-100 text-amber-700"
                        : inquiry.status === "contacted"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-slate-200 text-slate-700"
                    }`}
                  >
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
