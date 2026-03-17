import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import PropertyForm from "../components/PropertyForm.jsx";
import {
  createProperty,
  fetchInquiries,
  fetchMyProperties,
  updateInquiryStatus,
  updateProperty
} from "../services/api.js";
import { formatNumber } from "../utils/format.js";

const DashboardPage = () => {
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sortedProperties = useMemo(
    () => [...properties].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [properties]
  );

  const stats = useMemo(() => {
    const approved = properties.filter((property) => property.approvalStatus === "approved").length;
    const pending = properties.filter((property) => property.approvalStatus === "pending").length;
    const rejected = properties.filter((property) => property.approvalStatus === "rejected").length;
    const totalViews = properties.reduce((sum, property) => sum + Number(property.views || 0), 0);

    return [
      { label: "Total listings", value: properties.length },
      { label: "Approved", value: approved },
      { label: "Pending", value: pending },
      { label: "Rejected", value: rejected },
      { label: "Views", value: formatNumber(totalViews) },
      { label: "Inquiries", value: inquiries.length }
    ];
  }, [inquiries.length, properties]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [propertiesResponse, inquiriesResponse] = await Promise.all([
        fetchMyProperties(),
        fetchInquiries({ scope: "received" })
      ]);

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
        setSuccess("Property updated and sent for admin review.");
      } else {
        await createProperty(payload);
        setSuccess("Property created and sent for admin review.");
      }

      setEditingProperty(null);
      await loadData();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInquiryStatus = async (id, status) => {
    try {
      await updateInquiryStatus(id, status);
      setInquiries((current) =>
        current.map((inquiry) => (inquiry._id === id ? { ...inquiry, status } : inquiry))
      );
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">User dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Manage your listings and incoming leads</h1>
        <p className="mt-2 text-sm text-slate-500">
          Add new properties, update existing ones, and keep track of buyer inquiries from one place.
        </p>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p> : null}

      <AnalyticsCards items={stats} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PropertyForm
          initialProperty={editingProperty}
          onSubmit={handleSubmit}
          isSubmitting={saving}
          onCancel={() => setEditingProperty(null)}
        />

        <div className="card">
          <h2 className="text-2xl font-bold text-slate-900">My Properties</h2>
          <p className="mt-2 text-sm text-slate-500">
            Edit your listings and resubmit updates for admin approval when needed.
          </p>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-slate-500">Loading your properties...</p>
            ) : (
              <DashboardPropertyTable
                properties={sortedProperties}
                onEdit={setEditingProperty}
                loadingId={busyId}
              />
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-slate-900">Incoming Inquiries</h2>
        <p className="mt-2 text-sm text-slate-500">
          Track buyer interest and update lead status as you respond.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading inquiries...</p>
          ) : (
            <InquiryTable inquiries={inquiries} editable onStatusChange={handleInquiryStatus} />
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
