import {
  BarChart3,
  Building2,
  Clapperboard,
  LayoutDashboard,
  MessageSquareMore,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import AnalyticsCards from "../components/AnalyticsCards.jsx";
import DashboardPropertyTable from "../components/DashboardPropertyTable.jsx";
import InquiryTable from "../components/InquiryTable.jsx";
import PropertyForm from "../components/PropertyForm.jsx";
import Seo from "../components/Seo.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
import {
  createProperty,
  deleteProperty,
  fetchAdminAnalytics,
  fetchAdminProperties,
  fetchInquiries,
  updateInquiryStatus,
  updateProperty,
  updatePropertyApproval,
  updatePropertyFeatured,
  uploadPropertyMedia
} from "../services/api.js";

const adminNav = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "studio", label: "Property Studio", icon: Clapperboard },
  { id: "inventory", label: "Inventory", icon: Building2 },
  { id: "leads", label: "Leads", icon: MessageSquareMore }
];

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
      { label: "Properties", value: totals.totalProperties ?? 0, icon: Building2, helper: "Live inventory count" },
      { label: "Approved", value: totals.approvedProperties ?? 0, icon: ShieldCheck, helper: "Visible on website" },
      { label: "Pending", value: totals.pendingProperties ?? 0, icon: Sparkles, helper: "Awaiting review" },
      { label: "Featured", value: totals.featuredProperties ?? 0, icon: Clapperboard, helper: "Premium listings" },
      { label: "Leads", value: totals.totalInquiries ?? 0, icon: MessageSquareMore, helper: "Active enquiries" },
      { label: "Users", value: totals.totalUsers ?? 0, icon: BarChart3, helper: "Platform accounts" }
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

  const preparePropertyPayload = async (payload) => {
    const {
      videoFiles = [],
      retainedVideos = [],
      retainedImages = [],
      youtubeUrl = "",
      videoTourUrl = "",
      images = [],
      ...rest
    } = payload;

    let uploadedVideoUrls = [];

    if (videoFiles.length > 0) {
      try {
        const uploadedItems = await uploadPropertyMedia(videoFiles);
        uploadedVideoUrls = uploadedItems
          .filter((entry) => entry?.type === "video" || entry?.path || entry?.url)
          .map((entry) => entry.path || entry.url)
          .filter(Boolean);
      } catch (mediaError) {
        throw new Error(
          `${mediaError.message} If video uploads are not available on this API yet, use the hosted video URL or YouTube link fields instead.`
        );
      }
    }

    const mergedVideoUrls = [...new Set([...retainedVideos, ...uploadedVideoUrls, videoTourUrl].filter(Boolean))];
    const media = [
      ...retainedImages.map((image) => ({ type: "image", url: image.url })),
      ...mergedVideoUrls.map((url) => ({ type: "video", url })),
      ...(youtubeUrl ? [{ type: "youtube", url: youtubeUrl }] : [])
    ];

    return {
      ...rest,
      youtubeUrl,
      videoTourUrl: videoTourUrl || mergedVideoUrls[0] || "",
      videos: mergedVideoUrls,
      media,
      images,
      retainedImages
    };
  };

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const requestPayload = await preparePropertyPayload(payload);

      if (editingProperty) {
        await updateProperty(editingProperty._id, requestPayload);
        setSuccess("Property updated successfully.");
      } else {
        await createProperty(requestPayload);
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
      setSuccess("Lead status updated successfully.");
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  return (
    <>
      <Seo
        title={`Admin Dashboard | ${COMPANY_INFO.name}`}
        description={`Protected property management dashboard for ${COMPANY_INFO.name}.`}
        canonical={`${COMPANY_INFO.canonicalUrl}/admin`}
        robots="noindex, nofollow"
      />

      <section className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[32px] border border-[#eadfcf] bg-white p-5 shadow-[0_20px_58px_rgba(15,23,42,0.08)]">
              <div>
                <p className="section-kicker">Admin Control</p>
                <h1 className="mt-2 text-3xl font-semibold text-ink-900">Premium inventory dashboard</h1>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Manage listings, featured visibility, and lead flow with a cleaner, more usable control surface.
                </p>
              </div>

              <nav className="mt-6 space-y-2">
                {adminNav.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-3 rounded-[22px] border border-[#ece2d4] bg-[#fbf8f2] px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-gold-300 hover:bg-white"
                    >
                      <Icon size={16} className="text-gold-600" />
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-[24px] border border-gold-300/40 bg-[#fbf2df] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-700">Workflow Tip</p>
                <p className="mt-3 text-sm leading-7 text-ink-600">
                  Add exact location fields, amenities, and one strong cover image first, then layer video for a more
                  premium public listing.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section id="overview" className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
              <p className="section-kicker">Admin Dashboard</p>
              <h2 className="mt-2 text-4xl font-semibold text-ink-900">Manage, feature, and publish premium property listings</h2>
              <p className="mt-4 max-w-4xl text-sm leading-8 text-ink-500">
                This protected dashboard keeps the existing backend workflow intact while improving layout, readability,
                table clarity, and property authoring quality.
              </p>
            </section>

            {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
            {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p> : null}

            <section className="pt-0">
              <AnalyticsCards items={analyticsItems} />
            </section>

            <section id="studio" className="grid gap-6 2xl:grid-cols-[1.04fr_0.96fr]">
              <PropertyForm
                initialProperty={editingProperty}
                onSubmit={handleSubmit}
                isSubmitting={saving}
                onCancel={() => setEditingProperty(null)}
              />

              <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="section-kicker">Publishing Standards</p>
                    <h2 className="mt-2 text-3xl font-semibold text-ink-900">Keep every live listing premium and conversion-ready</h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-[#f7ecd7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                    <Sparkles size={14} />
                    Owner Control
                  </span>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[26px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
                    <p className="text-lg font-semibold text-ink-900">Image-first presentation</p>
                    <p className="mt-3 text-sm leading-7 text-ink-500">
                      Cover visuals, gallery framing, and clean copy all affect how premium the property feels on the public site.
                    </p>
                  </div>
                  <div className="rounded-[26px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
                    <p className="text-lg font-semibold text-ink-900">Builder-grade detail pages</p>
                    <p className="mt-3 text-sm leading-7 text-ink-500">
                      Amenities, area, room counts, and location specifics now help each public detail page feel more complete.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="inventory" className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
              <h2 className="text-3xl font-semibold text-ink-900">Manage Listings</h2>
              <p className="mt-2 text-sm leading-7 text-ink-500">
                Approve, reject, feature, edit, or delete any listing from the property inventory.
              </p>

              <div className="mt-6">
                {loading ? (
                  <p className="text-sm text-ink-500">Loading listings...</p>
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
            </section>

            <section id="leads" className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
              <h2 className="text-3xl font-semibold text-ink-900">Lead Management</h2>
              <p className="mt-2 text-sm leading-7 text-ink-500">
                Review contact requests, property leads, sell-property submissions, and contract applications in one place.
              </p>

              <div className="mt-6">
                {loading ? (
                  <p className="text-sm text-ink-500">Loading leads...</p>
                ) : (
                  <InquiryTable inquiries={inquiries} editable onStatusChange={handleLeadStatus} />
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboardPage;
