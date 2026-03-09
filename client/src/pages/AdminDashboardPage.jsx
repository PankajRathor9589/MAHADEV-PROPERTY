import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import PropertyForm from "../components/PropertyForm.jsx";
import SellerManagementTable from "../components/SellerManagementTable.jsx";
import {
  createProperty,
  deleteProperty,
  fetchAdminAnalytics,
  fetchAdminInquiries,
  fetchAdminSellers,
  fetchProperties,
  markPropertySold,
  updateProperty,
  updatePropertyApproval,
  updateSellerStatus
} from "../services/api.js";

const AdminDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedProperties = useMemo(() => {
    return [...properties].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [properties]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [propertiesRes, analyticsRes, sellersRes, inquiriesRes] = await Promise.all([
        fetchProperties({ includeSold: true, limit: 200, page: 1 }),
        fetchAdminAnalytics(),
        fetchAdminSellers(),
        fetchAdminInquiries()
      ]);

      setProperties(propertiesRes.data || []);
      setAnalytics(analyticsRes);
      setSellers(sellersRes || []);
      setInquiries(inquiriesRes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (editingProperty) {
        await updateProperty(editingProperty._id, payload);
        setSuccess("Property updated.");
      } else {
        await createProperty(payload);
        setSuccess("Property created.");
      }

      setEditingProperty(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this listing?");
    if (!confirmed) {
      return;
    }

    try {
      setBusyId(id);
      await deleteProperty(id);
      setSuccess("Listing deleted.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const handleMarkSold = async (id) => {
    try {
      setBusyId(id);
      await markPropertySold(id);
      setSuccess("Property marked sold.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const handleApprove = async (id) => {
    try {
      setBusyId(id);
      await updatePropertyApproval(id, "approved");
      setSuccess("Listing approved.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Rejection reason (optional):", "");
    try {
      setBusyId(id);
      await updatePropertyApproval(id, "rejected", reason || "");
      setSuccess("Listing rejected.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const handleSellerToggle = async (seller) => {
    try {
      await updateSellerStatus(seller._id, !seller.isActive);
      setSuccess("Seller status updated.");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const totals = analytics?.totals || {};
  const analyticsItems = [
    { label: "Total Listings", value: totals.totalProperties ?? 0 },
    { label: "Approved", value: totals.approvedProperties ?? 0 },
    { label: "Pending", value: totals.pendingProperties ?? 0 },
    { label: "Rejected", value: totals.rejectedProperties ?? 0 },
    { label: "Sold", value: totals.soldProperties ?? 0 },
    { label: "Sellers", value: totals.totalSellers ?? 0 },
    { label: "Inquiries", value: totals.totalInquiries ?? 0 }
  ];

  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-r from-cyan-50 to-white">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Review and approve listings, manage sellers, and monitor platform analytics.
        </p>
      </section>

      {error ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      <AnalyticsCards items={analyticsItems} />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PropertyForm
          initialProperty={editingProperty}
          onSubmit={handleSubmit}
          isSubmitting={saving}
          onCancel={() => setEditingProperty(null)}
          showApprovalControls
        />

        <div className="card space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Manage Listings</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading listings...</p>
          ) : (
            <DashboardPropertyTable
              properties={sortedProperties}
              onEdit={setEditingProperty}
              onDelete={handleDelete}
              onMarkSold={handleMarkSold}
              onApprove={handleApprove}
              onReject={handleReject}
              loadingId={busyId}
            />
          )}
        </div>
      </div>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Manage Sellers</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading sellers...</p>
        ) : (
          <SellerManagementTable sellers={sellers} onToggleStatus={handleSellerToggle} />
        )}
      </section>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">All Inquiries</h2>
        {loading ? <p className="text-sm text-slate-500">Loading inquiries...</p> : <InquiryTable inquiries={inquiries} />}
      </section>

      {analytics?.monthlyListings?.length > 0 && (
        <section className="card">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">Monthly Listing Trend</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analytics.monthlyListings.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{item.listings}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboardPage;
