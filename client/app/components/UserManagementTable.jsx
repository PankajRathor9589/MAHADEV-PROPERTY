const UserManagementTable = ({ users, onToggleStatus, onToggleRole }) => {
  if (!users.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
        No users found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500">
            <th className="pb-3 pr-4 font-semibold">User</th>
            <th className="pb-3 pr-4 font-semibold">Role</th>
            <th className="pb-3 pr-4 font-semibold">Listings</th>
            <th className="pb-3 pr-4 font-semibold">Favorites</th>
            <th className="pb-3 pr-4 font-semibold">Status</th>
            <th className="pb-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-slate-100 align-top">
              <td className="py-4 pr-4">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                {user.phone ? <p className="text-xs text-slate-500">{user.phone}</p> : null}
              </td>
              <td className="py-4 pr-4 capitalize text-slate-700">{user.role}</td>
              <td className="py-4 pr-4 text-slate-600">{user.propertyCount}</td>
              <td className="py-4 pr-4 text-slate-600">{user.favoriteCount}</td>
              <td className="py-4 pr-4">
                <span className={`badge ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                  {user.isActive ? "Active" : "Disabled"}
                </span>
              </td>
              <td className="py-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onToggleStatus?.(user)}
                  >
                    {user.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onToggleRole?.(user, user.role === "admin" ? "user" : "admin")}
                  >
                    Make {user.role === "admin" ? "User" : "Admin"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagementTable;
