import { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaClipboardCheck,
  FaInbox,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUserShield,
  FaUsers
} from "react-icons/fa";
import { adminApi, inquiryApi, propertyApi } from "../api/services";
import {
  AnalyticsBarCard,
  AnalyticsComparisonBarCard,
  AnalyticsDonutCard
} from "../components/dashboard/AnalyticsCharts";
import StatsCard from "../components/dashboard/StatsCard";
import Seo from "../components/ui/Seo";
import { ChartSkeleton } from "../components/ui/Skeletons";
import { formatPrice } from "../utils/format";

const roleOptions = ["all", "buyer", "agent", "admin"];
const queueOptions = ["all", "pending", "approved", "rejected"];

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [queueFilter, setQueueFilter] = useState("all");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [stats, userData, propertyData, inquiryData] = await Promise.all([
        adminApi.analytics(),
        adminApi.users(),
        adminApi.moderationQueue(),
        inquiryApi.list()
      ]);

      setAnalytics(stats.data?.totals || stats.data);
      setUsers(userData);
      setProperties(propertyData);
      setInquiries(inquiryData);
      setSelectedPropertyId((current) => {
        if (propertyData.some((property) => property.id === current)) {
          return current;
        }

        return propertyData.find((property) => property.status === "pending")?.id || propertyData[0]?.id || null;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (id, status) => {
    await adminApi.moderateProperty(id, {
      status,
      rejectedReason: status === "rejected" ? "Listing needs more detail before publication." : ""
    });
    await load();
  };

  const toggleUser = async (user) => {
    await adminApi.updateAgentStatus(user._id || user.id, !user.isActive);
    await load();
  };

  const removeProperty = async (id) => {
    await propertyApi.remove(id);
    await load();
  };

  const totalViews = useMemo(() => properties.reduce((sum, property) => sum + Number(property.views || 0), 0), [properties]);
  const activeUsers = useMemo(() => users.filter((user) => user.isActive).length, [users]);
  const openLeads = useMemo(() => inquiries.filter((inquiry) => inquiry.status !== "closed").length, [inquiries]);

  const moderationStatusChart = useMemo(
    () => [
      { label: "Approved", value: properties.filter((property) => property.status === "approved").length },
      { label: "Pending", value: properties.filter((property) => property.status === "pending").length },
      { label: "Rejected", value: properties.filter((property) => property.status === "rejected").length }
    ],
    [properties]
  );

  const roleMixChart = useMemo(
    () => [
      { label: "Buyers", value: users.filter((user) => user.role === "buyer").length },
      { label: "Agents", value: users.filter((user) => user.role === "agent").length },
      { label: "Admins", value: users.filter((user) => user.role === "admin").length }
    ],
    [users]
  );

  const citySupplyDemandChart = useMemo(() => {
    const byCity = {};

    properties.forEach((property) => {
      byCity[property.city] = byCity[property.city] || { label: property.city, listings: 0, inquiries: 0 };
      byCity[property.city].listings += 1;
    });

    inquiries.forEach((inquiry) => {
      const city = inquiry.property?.city || "Unknown";
      byCity[city] = byCity[city] || { label: city, listings: 0, inquiries: 0 };
      byCity[city].inquiries += 1;
    });

    return Object.values(byCity)
      .sort((left, right) => right.inquiries - left.inquiries || right.listings - left.listings)
      .slice(0, 6);
  }, [properties, inquiries]);

  const filteredQueue = useMemo(
    () => properties.filter((property) => queueFilter === "all" || property.status === queueFilter),
    [properties, queueFilter]
  );

  const selectedProperty =
    filteredQueue.find((property) => property.id === selectedPropertyId) ||
    properties.find((property) => property.id === selectedPropertyId) ||
    filteredQueue[0] ||
    null;

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter;
        const searchable = [user.name, user.email, user.phone, user.role].filter(Boolean).join(" ").toLowerCase();
        const matchesSearch = searchable.includes(userSearch.toLowerCase());
        return matchesRole && matchesSearch;
      }),
    [userRoleFilter, userSearch, users]
  );

  const latestInquiries = useMemo(
    () => [...inquiries].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 6),
    [inquiries]
  );

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage moderation, users, approvals, and platform statistics from the admin dashboard." />

      <div className="space-y-8">
        <section className="panel-card overflow-hidden p-0">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div>
              <p className="surface-label">Admin dashboard</p>
              <h1 className="section-heading mt-2 text-4xl">Moderate supply, manage users, and watch platform health in one workspace</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                The admin view now emphasizes review speed and decision clarity with a focused approval panel, searchable user management, and platform-wide charts for supply and demand.
              </p>
            </div>
            <div className="rounded-[28px] bg-slate-50 px-5 py-5">
              <p className="surface-label">Today&apos;s focus</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[22px] bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-semibold text-ink">{moderationStatusChart[1]?.value || 0} listings pending review</p>
                </div>
                <div className="rounded-[22px] bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-semibold text-ink">{openLeads} open inquiries still active</p>
                </div>
                <div className="rounded-[22px] bg-white px-4 py-3 shadow-soft">
                  <p className="text-sm font-semibold text-ink">{activeUsers} active users across the platform</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {analytics && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="Platform listings"
              value={analytics.totalProperties || 0}
              tone="brand"
              icon={FaClipboardCheck}
              helper="Published and moderated inventory"
            />
            <StatsCard
              label="Pending review"
              value={analytics.pendingProperties || 0}
              tone="sand"
              icon={FaInbox}
              helper="Listings waiting for a decision"
            />
            <StatsCard
              label="Active users"
              value={activeUsers}
              tone="ink"
              icon={FaUsers}
              helper={`${users.length} total platform accounts`}
            />
            <StatsCard
              label="Platform views"
              value={totalViews}
              tone="brand"
              icon={FaUserShield}
              helper={`${openLeads} inquiries still open`}
            />
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 xl:grid-cols-3">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-3">
            <AnalyticsBarCard
              title="Moderation queue status"
              description="Watch the balance between approved, pending, and rejected inventory."
              data={moderationStatusChart}
            />
            <AnalyticsDonutCard
              title="User role mix"
              description="Understand the current composition of buyers, agents, and admins."
              data={roleMixChart}
            />
            <AnalyticsComparisonBarCard
              title="Supply vs demand by city"
              description="Compare listing volume against inquiry activity in your busiest locations."
              data={citySupplyDemandChart}
              primaryKey="listings"
              secondaryKey="inquiries"
              primaryLabel="Listings"
              secondaryLabel="Inquiries"
            />
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="table-grid">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 md:px-6">
              <div>
                <p className="surface-label">Moderation queue</p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">Property approval panel input</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {queueOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setQueueFilter(option)}
                    className={queueFilter === option ? "btn-primary px-4 py-2" : "btn-secondary px-4 py-2"}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {filteredQueue.map((property) => (
              <button
                key={property.id}
                type="button"
                onClick={() => setSelectedPropertyId(property.id)}
                className={`table-row w-full text-left md:grid-cols-[1.3fr_0.7fr_0.8fr] ${
                  selectedProperty?.id === property.id ? "bg-brand-50/70" : "bg-transparent"
                }`}
              >
                <div>
                  <p className="font-semibold text-ink">{property.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {property.city} · {property.propertyType}
                  </p>
                </div>
                <div>
                  <span
                    className={`status-badge ${
                      property.status === "approved"
                        ? "status-approved"
                        : property.status === "rejected"
                          ? "status-rejected"
                          : "status-pending"
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
                <p>{formatPrice(property.price)}</p>
              </button>
            ))}

            {!loading && filteredQueue.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-500">No properties match this moderation filter.</div>
            )}
          </div>

          <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card">
            <p className="surface-label">Property approval panel</p>
            {selectedProperty ? (
              <>
                <div className="mt-3 overflow-hidden rounded-[24px] bg-slate-100">
                  <img
                    src={selectedProperty.images?.[0]?.url}
                    alt={selectedProperty.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-ink">{selectedProperty.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{selectedProperty.location}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                    <p className="surface-label">Agent</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{selectedProperty.agent?.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{selectedProperty.agent?.email}</p>
                  </div>
                  <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                    <p className="surface-label">Price</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatPrice(selectedProperty.price)}</p>
                    <p className="mt-1 text-xs text-slate-500">{selectedProperty.area || 0} sq.ft</p>
                  </div>
                </div>
                <div className="mt-4 rounded-[22px] bg-slate-50 px-4 py-4">
                  <p className="surface-label">Description</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{selectedProperty.description}</p>
                </div>
                {selectedProperty.amenities?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedProperty.amenities.slice(0, 6).map((item) => (
                      <span key={item} className="stat-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" className="btn-primary" onClick={() => moderate(selectedProperty.id, "approved")}>
                    <FaCheck />
                    Approve
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => moderate(selectedProperty.id, "rejected")}>
                    <FaTimes />
                    Reject
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => removeProperty(selectedProperty.id)}>
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-slate-600">Select a property from the moderation queue to review it here.</p>
            )}
          </section>
        </section>

        <section className="table-grid">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-5 md:px-6">
            <div>
              <p className="surface-label">User management table</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">Platform users</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="field min-w-[220px] pl-10"
                  placeholder="Search users"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                />
              </div>
              <select className="field min-w-[150px]" value={userRoleFilter} onChange={(event) => setUserRoleFilter(event.target.value)}>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden grid-cols-[1.2fr_0.7fr_0.9fr_0.8fr_0.8fr] gap-3 bg-slate-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <span>User</span>
            <span>Role</span>
            <span>Contact</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {filteredUsers.map((user) => (
            <div key={user._id || user.id} className="table-row md:grid-cols-[1.2fr_0.7fr_0.9fr_0.8fr_0.8fr]">
              <div>
                <p className="font-semibold text-ink">{user.name}</p>
                <p className="mt-1 text-xs text-slate-500">{user.email}</p>
              </div>
              <p className="capitalize text-slate-700">{user.role}</p>
              <p>{user.phone || "No phone"}</p>
              <div>
                <span className={`status-badge ${user.isActive ? "status-approved" : "status-rejected"}`}>
                  {user.isActive ? "active" : "inactive"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.role !== "admin" && (
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => toggleUser(user)}>
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {!loading && filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">No users match the current search and role filter.</div>
          )}
        </section>

        <section className="table-grid">
          <div className="px-4 py-5 md:px-6">
            <p className="surface-label">Platform statistics</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Latest inquiry activity</h2>
          </div>
          {latestInquiries.map((inquiry) => (
            <div key={inquiry.id} className="table-row md:grid-cols-[1.1fr_1fr_0.8fr]">
              <div>
                <p className="font-semibold text-ink">{inquiry.name}</p>
                <p className="mt-1 text-xs text-slate-500">{inquiry.email || inquiry.phone}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">{inquiry.property?.title || "Property"}</p>
                <p className="mt-1 text-xs text-slate-500">{inquiry.message || "No message provided"}</p>
              </div>
              <div>
                <span
                  className={`status-badge ${
                    inquiry.status === "closed"
                      ? "status-approved"
                      : inquiry.status === "contacted"
                        ? "status-pending"
                        : "status-rejected"
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>
            </div>
          ))}
          {!loading && latestInquiries.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">No inquiries available yet.</div>
          )}
        </section>
      </div>
    </>
  );
};

export default AdminPage;
