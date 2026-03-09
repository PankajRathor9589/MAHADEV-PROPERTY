const SellerManagementTable = ({ sellers, onToggleStatus }) => {
  if (!sellers.length) {
    return <p className="text-sm text-slate-500">No sellers found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3">Seller</th>
            <th className="px-3 py-3">Contact</th>
            <th className="px-3 py-3">Properties</th>
            <th className="px-3 py-3">Inquiries</th>
            <th className="px-3 py-3">Status</th>
            <th className="px-3 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((seller) => (
            <tr key={seller._id} className="border-b border-slate-200 last:border-none">
              <td className="px-3 py-3 font-medium text-slate-800">{seller.name}</td>
              <td className="px-3 py-3 text-slate-600">
                <div>{seller.email}</div>
                <div>{seller.phone || "-"}</div>
              </td>
              <td className="px-3 py-3 text-slate-600">
                <div>Total: {seller.totalProperties}</div>
                <div>Active: {seller.activeListings}</div>
              </td>
              <td className="px-3 py-3 text-slate-600">{seller.totalInquiries}</td>
              <td className="px-3 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    seller.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {seller.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-3 py-3 text-right">
                <button className="btn-secondary" onClick={() => onToggleStatus(seller)}>
                  {seller.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SellerManagementTable;
