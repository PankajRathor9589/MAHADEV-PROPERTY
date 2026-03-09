import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import PropertyForm from "../components/PropertyForm.jsx";
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  fetchSellerAnalytics,
  fetchSellerInquiries,
  markPropertySold,
  updateProperty,
  updateSellerInquiryStatus
} from "../services/api.js";

const SellerDashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
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
      const [propertiesRes, analyticsRes, inquiriesRes] = await Promise.all([
        fetchProperties({ mine: true, includeSold: true, limit: 100, page: 1 }),
        fetchSellerAnalytics(),
        fetchSellerInquiries()
      ]);

      setProperties(propertiesRes.data || []);
      setAnalytics(analyticsRes);
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
        setSuccess("Property updated and sent for approval.");
      } else {
        await createProperty(payload);
        setSuccess("Property created and sent for admin approval.");
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
    const confirmed = window.confirm("Delete this property?");
    if (!confirmed) {
      return;
    }

    try {
      setBusyId(id);
      setError("");
      await deleteProperty(id);
      setSuccess("Property deleted.");
      if (editingProperty?._id === id) {
        setEditingProperty(null);
      }
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
      setError("");
      await markPropertySold(id);
      setSuccess("Property marked as sold.");
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      await updateSellerInquiryStatus(id, status);
      setInquiries((prev) => prev.map((item) => (item._id === id ? { ...item, status } : item)));
    } catch (err) {
      setError(err.message);
    }
  };

  const analyticsItems = [
    { label: "Total Listings", value: analytics?.totalProperties ?? 0 },
    { label: "Approved", value: analytics?.approvedProperties ?? 0 },
    { label: "Pending", value: analytics?.pendingProperties ?? 0 },
    { label: "Sold", value: analytics?.soldProperties ?? 0 },
    { label: "Total Views", value: analytics?.totalViews ?? 0 },
    { label: "Inquiries", value: analytics?.totalInquiries ?? 0 },
    { label: "New Inquiries", value: analytics?.newInquiries ?? 0 }
  ];

  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-r from-cyan-50 to-white">
        <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your property listings, update status, and respond to buyer inquiries.
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
        />

        <div className="card">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">My Properties</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading properties...</p>
          ) : (
            <DashboardPropertyTable
              properties={sortedProperties}
              onEdit={setEditingProperty}
              onDelete={handleDelete}
              onMarkSold={handleMarkSold}
              loadingId={busyId}
            />
          )}
        </div>
      </div>

      <section className="card">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Buyer Inquiries</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading inquiries...</p>
        ) : (
          <InquiryTable inquiries={inquiries} editable onStatusChange={handleInquiryStatus} />
        )}
      </section>
    </div>
  );
};

export default SellerDashboardPage;
