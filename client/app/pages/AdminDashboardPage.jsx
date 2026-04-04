import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import PropertyForm from "../components/PropertyForm.jsx";
import {
  createProperty,
  deleteProperty,
  fetchAdminAnalytics,
  fetchAdminProperties,
  fetchInquiries,
  updateInquiryStatus,
  updateProperty,
  updatePropertyApproval,
  updatePropertyFeatured
} from "../services/api.js";

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const analyticsItems = useMemo(() => {
    const totals = analytics?.totals || {};

    return [
      { label: "Properties", value: totals.totalProperties ?? 0 },
      { label: "Approved", value: totals.approvedProperties ?? 0 },
      { label: "Pending", value: totals.pendingProperties ?? 0 },
      { label: "Featured", value: totals.featuredProperties ?? 0 },
      { label: "Leads", value: totals.totalInquiries ?? 0 },
      { label: "Admins", value: totals.totalAdmins ?? 0 }
    ];
  }, [analytics]);

  const sortedProperties = useMemo(
    () => [...properties].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [properties]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, propertiesResponse, inquiriesResponse] = await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminProperties(),
        fetchInquiries()
      ]);

      setAnalytics(analyticsResponse.data || {});
      setProperties(propertiesResponse.data || []);
      setInquiries(inquiriesResponse.data || []);
    } catch (loadError) {
      setError(loadError.message);
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
        setSuccess("Property updated successfully.");
      } else {
        await createProperty(payload);
        setSuccess("Property created successfully.");
      }

      setEditingProperty(null);
      await loadData();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setBusyId(id);
      await updatePropertyApproval(id, "approved");
      setSuccess("Property approved successfully.");
      await loadData();
    } catch (approveError) {
      setError(approveError.message);
    } finally {
      setBusyId("");
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = window.prompt("Reason for rejection (optional)", "") || "";

    try {
      setBusyId(id);
      await updatePropertyApproval(id, "rejected", rejectionReason);
      setSuccess("Property rejected successfully.");
      await loadData();
    } catch (rejectError) {
      setError(rejectError.message);
    } finally {
      setBusyId("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property permanently?")) {
      return;
    }

    try {
      setBusyId(id);
      await deleteProperty(id);
      setSuccess("Property deleted successfully.");
      if (editingProperty?._id === id) {
        setEditingProperty(null);
      }
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setBusyId("");
    }
  };

  const handleToggleFeatured = async (property) => {
    try {
      setBusyId(property._id);

      if (property.isFeatured) {
        await updatePropertyFeatured(property._id, false);
      } else {
        const daysInput = window.prompt("Feature this property for how many days?", "30");
        const featuredDays = Math.max(1, Number(daysInput) || 30);
        await updatePropertyFeatured(property._id, true, featuredDays);
      }

      setSuccess("Featured status updated.");
      await loadData();
    } catch (featuredError) {
      setError(featuredError.message);
    } finally {
      setBusyId("");
    }
  };

  const handleLeadStatus = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries((current) => current.map((item) => (item._id === id ? { ...item, status } : item)));
      setSuccess("Lead status updated.");
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="section-shell">
        <div className="card surface-grid">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-200/80">Admin Panel</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-white">Add listings, moderate inventory, and manage leads</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/60">
            This console lets you create and delete property listings, review approvals, feature premium inventory, and track every incoming lead from the public site.
          </p>
        </div>
      </section>

      <section className="section-shell">
        {error ? <p className="rounded-2xl bg-rose-500/12 p-4 text-sm text-rose-200">{error}</p> : null}
        {success ? <p className="rounded-2xl bg-emerald-500/12 p-4 text-sm text-emerald-200">{success}</p> : null}
      </section>

      <section className="section-shell">
        <AnalyticsCards items={analyticsItems} />
      </section>

      <section className="section-shell grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <PropertyForm
          initialProperty={editingProperty}
          onSubmit={handleSubmit}
          isSubmitting={saving}
          onCancel={() => setEditingProperty(null)}
        />

        <div className="card">
          <h2 className="text-2xl font-semibold text-white">Manage Listings</h2>
          <p className="mt-2 text-sm text-white/60">
            Edit, approve, reject, feature, or delete any property from the inventory.
          </p>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-white/60">Loading listings...</p>
            ) : (
              <DashboardPropertyTable
                properties={sortedProperties}
                onEdit={setEditingProperty}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
                onToggleFeatured={handleToggleFeatured}
                loadingId={busyId}
              />
            )}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="card">
          <h2 className="text-2xl font-semibold text-white">Lead Management</h2>
          <p className="mt-2 text-sm text-white/60">
            Review property enquiries, homepage callback requests, and book-visit submissions in one place.
          </p>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-white/60">Loading leads...</p>
            ) : (
              <InquiryTable inquiries={inquiries} editable onStatusChange={handleLeadStatus} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
