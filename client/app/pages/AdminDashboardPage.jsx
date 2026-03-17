import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import UserManagementTable from "../components/UserManagementTable.jsx";
import {
  deleteProperty,
  fetchAdminAnalytics,
  fetchAdminProperties,
  fetchAdminUsers,
  fetchInquiries,
  updateAdminUser,
  updatePropertyApproval,
  updatePropertyFeatured
} from "../services/api.js";

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const analyticsItems = useMemo(() => {
    const totals = analytics?.totals || {};

    return [
      { label: "Users", value: totals.totalUsers ?? 0 },
      { label: "Properties", value: totals.totalProperties ?? 0 },
      { label: "Approved", value: totals.approvedProperties ?? 0 },
      { label: "Pending", value: totals.pendingProperties ?? 0 },
      { label: "Featured", value: totals.featuredProperties ?? 0 },
      { label: "Inquiries", value: totals.totalInquiries ?? 0 }
    ];
  }, [analytics]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, propertiesResponse, usersResponse, inquiriesResponse] = await Promise.all([
        fetchAdminAnalytics(),
        fetchAdminProperties(),
        fetchAdminUsers(),
        fetchInquiries()
      ]);

      setAnalytics(analyticsResponse.data || {});
      setProperties(propertiesResponse.data || []);
      setUsers(usersResponse.data || []);
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
    const confirmed = window.confirm("Delete this property permanently?");
    if (!confirmed) {
      return;
    }

    try {
      setBusyId(id);
      await deleteProperty(id);
      setSuccess("Property deleted successfully.");
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

  const handleToggleStatus = async (user) => {
    try {
      await updateAdminUser(user._id, { isActive: !user.isActive });
      setSuccess("User status updated.");
      await loadData();
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const handleToggleRole = async (user, nextRole) => {
    try {
      await updateAdminUser(user._id, { role: nextRole });
      setSuccess("User role updated.");
      await loadData();
    } catch (roleError) {
      setError(roleError.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Admin console</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Moderate listings and manage platform users</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review property submissions, highlight premium listings, and control user access.
        </p>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p> : null}

      <AnalyticsCards items={analyticsItems} />

      <section className="card">
        <h2 className="text-2xl font-bold text-slate-900">Property Moderation Queue</h2>
        <p className="mt-2 text-sm text-slate-500">
          Approve, reject, feature, or delete listings to keep the marketplace healthy.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading properties...</p>
          ) : (
            <DashboardPropertyTable
              properties={properties}
              mode="admin"
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              loadingId={busyId}
            />
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <p className="mt-2 text-sm text-slate-500">
          Enable or disable accounts and promote trusted members to admin access.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : (
            <UserManagementTable
              users={users}
              onToggleStatus={handleToggleStatus}
              onToggleRole={handleToggleRole}
            />
          )}
        </div>
      </section>

      <section className="card">
        <h2 className="text-2xl font-bold text-slate-900">All Inquiries</h2>
        <p className="mt-2 text-sm text-slate-500">
          Review incoming lead traffic across the entire platform.
        </p>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading inquiries...</p>
          ) : (
            <InquiryTable inquiries={inquiries} />
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
