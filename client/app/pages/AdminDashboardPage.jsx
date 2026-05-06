import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Clapperboard,
  Crown,
  Landmark,
  LayoutDashboard,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards
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
  { id: "ecosystem", label: "Ecosystem", icon: ShieldCheck },
  { id: "saas", label: "Broker SaaS", icon: Crown },
  { id: "studio", label: "Property Studio", icon: Clapperboard },
  { id: "inventory", label: "Inventory", icon: Building2 },
  { id: "leads", label: "Lead Desk", icon: MessageSquareMore }
];

const saasPlans = [
  {
    title: "Starter",
    subtitle: "Independent expert launch",
    points: ["Unlimited listings", "WhatsApp-first CRM", "Lead timeline", "Basic performance analytics"]
  },
  {
    title: "Pro",
    subtitle: "Growing broker or micro-agency",
    points: ["Team inbox", "Featured inventory boosts", "Hot lead purchase queue", "Conversion tracking"]
  },
  {
    title: "Enterprise",
    subtitle: "Agency, builder, or regional network",
    points: ["Builder showcase layer", "Role-based team management", "Area heatmaps", "Priority onboarding and reporting"]
  }
];

const monetizationTracks = [
  {
    title: "Owner Revenue",
    copy: "Featured upgrades, urgent sale boosts, and premium visibility packages create one-time monetization around seller demand.",
    icon: Sparkles
  },
  {
    title: "Broker SaaS Revenue",
    copy: "Starter, Pro, and Enterprise plans create recurring revenue with analytics, CRM, listings, and lead access.",
    icon: Crown
  },
  {
    title: "Service Commissions",
    copy: "Home loans, legal verification, interiors, movers, and renovation extend revenue beyond the listing marketplace.",
    icon: WalletCards
  }
];

const SignalCard = ({ title, copy, icon: Icon }) => (
  <div className="rounded-[28px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
    <Icon size={18} className="text-gold-600" />
    <p className="mt-4 text-xl font-semibold text-ink-900">{title}</p>
    <p className="mt-3 text-sm leading-7 text-ink-500">{copy}</p>
  </div>
);

const ProgressBar = ({ label, count, total, helper }) => {
  const width = total > 0 ? Math.max(6, Math.round((count / total) * 100)) : 0;

  return (
    <div className="rounded-[24px] border border-[#ece1d3] bg-[#fbf8f2] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <p className="mt-1 text-sm text-ink-500">{helper}</p>
        </div>
        <span className="text-sm font-semibold text-ink-900">{count}</span>
      </div>
      <div className="mt-4 h-2.5 rounded-full bg-[#e7dccd]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0b1d3a] via-[#355489] to-[#d4af37]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

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
      { label: "Users", value: totals.totalUsers ?? 0, icon: Users, helper: "Platform accounts" }
    ];
  }, [analytics]);

  const sortedProperties = useMemo(
    () => [...properties].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [properties]
  );

  const ecosystemCards = useMemo(() => {
    const ownerCount = properties.filter((property) => property.approvalStatus === "approved" && !property.isFeatured).length;
    const expertCount = properties.filter((property) => property.isFeatured).length;
    const videoReady = properties.filter((property) => (property.videos || []).length > 0 || property.videoTourUrl).length;

    return [
      {
        title: "Direct Owner Marketplace",
        copy: `${ownerCount} verified-first listings currently support owner trust, no-brokerage messaging, and buyer-friendly contact journeys.`,
        icon: ShieldCheck
      },
      {
        title: "Verified Expert Network",
        copy: `${expertCount} premium or featured listings are ready to be positioned as broker, builder, or agency-grade inventory.`,
        icon: Crown
      },
      {
        title: "Media-Rich Property Studio",
        copy: `${videoReady} listings already support richer media, making the public site feel more cinematic and enterprise-ready.`,
        icon: Clapperboard
      }
    ];
  }, [properties]);

  const leadFunnel = useMemo(() => {
    const total = inquiries.length;
    const grouped = inquiries.reduce(
      (accumulator, inquiry) => {
        const status = String(inquiry.status || "new").toLowerCase();

        if (status.includes("new") || status.includes("pending")) {
          accumulator.new += 1;
        } else if (status.includes("contact")) {
          accumulator.contacted += 1;
        } else if (status.includes("qualified") || status.includes("scheduled")) {
          accumulator.qualified += 1;
        } else if (status.includes("close") || status.includes("won")) {
          accumulator.closed += 1;
        } else {
          accumulator.other += 1;
        }

        return accumulator;
      },
      { new: 0, contacted: 0, qualified: 0, closed: 0, other: 0 }
    );

    return { total, grouped };
  }, [inquiries]);

  const inventoryMix = useMemo(() => {
    const grouped = properties.reduce((accumulator, property) => {
      const key = property.category || "Other";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 4);
  }, [properties]);

  const locationMix = useMemo(() => {
    const grouped = properties.reduce((accumulator, property) => {
      const key = property.location?.city || property.location?.address || "Location pending";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);
  }, [properties]);

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
      retainedVideoMedia = [],
      retainedImages = [],
      youtubeUrl = "",
      videoTourUrl = "",
      images = [],
      ...rest
    } = payload;

    let uploadedVideoUrls = [];
    let uploadedVideoMedia = [];

    if (videoFiles.length > 0) {
      try {
        const uploadedItems = await uploadPropertyMedia(videoFiles);
        uploadedVideoMedia = uploadedItems
          .filter((entry) => entry?.type === "video" && (entry?.path || entry?.url))
          .map((entry, index) => ({
            type: "video",
            url: entry.path || entry.url,
            filename: entry.filename || "",
            label: entry.label || `Video ${index + 1}`
          }));
        uploadedVideoUrls = uploadedVideoMedia.map((entry) => entry.url);
      } catch (mediaError) {
        throw new Error(
          `${mediaError.message} If video uploads are not available on this API yet, use the hosted video URL or YouTube link fields instead.`
        );
      }
    }

    const mergedVideoUrls = [...new Set([...retainedVideos, ...uploadedVideoUrls, videoTourUrl].filter(Boolean))];
    const media = [
      ...retainedImages.map((image) => ({ type: "image", url: image.url })),
      ...uploadedVideoMedia,
      ...retainedVideoMedia
        .filter((entry) => !uploadedVideoMedia.some((uploadedItem) => uploadedItem.url === entry.url))
        .map((entry, index) => ({
          type: "video",
          url: entry.url,
          filename: entry.filename || "",
          label: entry.label || `Video ${index + 1}`
        })),
      ...(youtubeUrl ? [{ type: "youtube", url: youtubeUrl }] : [])
    ];

    return {
      ...rest,
      youtubeUrl,
      videoTourUrl: videoTourUrl || mergedVideoUrls[0] || "",
      videos: mergedVideoUrls,
      retainedVideos,
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
        <div className="grid gap-6 xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="rounded-[32px] border border-[#eadfcf] bg-white p-5 shadow-[0_20px_58px_rgba(15,23,42,0.08)]">
              <div>
                <p className="section-kicker">Admin Control</p>
                <h1 className="mt-2 text-3xl font-semibold text-ink-900">Luxury proptech operating system</h1>
                <p className="mt-3 text-sm leading-7 text-ink-500">
                  Manage the existing backend workflow while shaping Sagar Infra into a direct-owner marketplace and verified-expert SaaS ecosystem.
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
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gold-700">Operator Tip</p>
                <p className="mt-3 text-sm leading-7 text-ink-600">
                  Publish the cleanest owner and expert inventory first, then feature the highest-conviction listings to train the premium marketplace surface.
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section
              id="overview"
              className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7"
            >
              <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <div>
                  <p className="section-kicker">Enterprise Overview</p>
                  <h2 className="mt-2 text-4xl font-semibold text-ink-900">
                    One console for owner marketplace growth, expert SaaS, and premium trust operations.
                  </h2>
                  <p className="mt-4 max-w-4xl text-sm leading-8 text-ink-500">
                    The backend CRUD and lead flows stay intact, but the dashboard now reads like a product operating system:
                    direct-owner trust, verified expert monetization, lead intelligence, and analytics-led publishing.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                  {monetizationTracks.map((track) => (
                    <SignalCard key={track.title} title={track.title} copy={track.copy} icon={track.icon} />
                  ))}
                </div>
              </div>
            </section>

            {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
            {success ? <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{success}</p> : null}

            <section className="pt-0">
              <AnalyticsCards items={analyticsItems} />
            </section>

            <section
              id="ecosystem"
              className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Marketplace Ecosystem</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Direct owner, verified experts, and builder growth in one view</h2>
                </div>
                <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                  <ShieldCheck size={12} />
                  Trust + Monetization
                </span>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                {ecosystemCards.map((card) => (
                  <SignalCard key={card.title} title={card.title} copy={card.copy} icon={card.icon} />
                ))}
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                <div className="rounded-[30px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                  <p className="text-lg font-semibold text-ink-900">Inventory Mix</p>
                  <div className="mt-4 space-y-3">
                    {inventoryMix.length > 0 ? (
                      inventoryMix.map(([label, count]) => (
                        <ProgressBar
                          key={label}
                          label={label}
                          count={count}
                          total={Math.max(1, properties.length)}
                          helper="Visible category distribution"
                        />
                      ))
                    ) : (
                      <p className="text-sm text-ink-500">Inventory distribution appears here once properties load.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-[30px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                  <p className="text-lg font-semibold text-ink-900">Area Opportunity Snapshot</p>
                  <div className="mt-4 space-y-3">
                    {locationMix.length > 0 ? (
                      locationMix.map(([label, count]) => (
                        <ProgressBar
                          key={label}
                          label={label}
                          count={count}
                          total={Math.max(1, properties.length)}
                          helper="Location concentration and supply signal"
                        />
                      ))
                    ) : (
                      <p className="text-sm text-ink-500">Location trends appear here once inventory is available.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section
              id="saas"
              className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="section-kicker">Verified Expert SaaS</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Recurring-revenue dashboard system for brokers, agencies, and builders</h2>
                </div>
                <span className="badge border-gold-300/60 bg-[#f7ecd7] text-gold-700">
                  <Crown size={12} />
                  SaaS Stack
                </span>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-3">
                {saasPlans.map((plan) => (
                  <div key={plan.title} className="rounded-[30px] border border-[#ece1d3] bg-[#fbf8f2] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">{plan.title}</p>
                    <p className="mt-2 text-2xl font-semibold text-ink-900">{plan.subtitle}</p>
                    <div className="mt-4 space-y-3">
                      {plan.points.map((point) => (
                        <div key={point} className="rounded-[20px] border border-[#e9dfd2] bg-white px-4 py-3 text-sm text-ink-700">
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-3">
                <SignalCard
                  title="Agency Dashboard"
                  copy="Role-aware pipelines, team performance, and shared lead ownership prepare the system for multi-agent operations."
                  icon={BriefcaseBusiness}
                />
                <SignalCard
                  title="Builder Command Center"
                  copy="Builder showcase pages, launch campaigns, and inventory performance reporting help premium projects feel enterprise-grade."
                  icon={Building2}
                />
                <SignalCard
                  title="CRM + Lead Marketplace"
                  copy="Hot lead queues, follow-up reminders, and conversion reports pave the way for recurring SaaS plus transactional revenue."
                  icon={MessageSquareMore}
                />
              </div>
            </section>

            <section id="studio" className="grid gap-6 2xl:grid-cols-[1.04fr_0.96fr]">
              <PropertyForm
                initialProperty={editingProperty}
                onSubmit={handleSubmit}
                isSubmitting={saving}
                onCancel={() => setEditingProperty(null)}
              />

              <div className="space-y-6">
                <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="section-kicker">Publishing Standards</p>
                      <h2 className="mt-2 text-3xl font-semibold text-ink-900">Keep every live listing premium and conversion-ready</h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-gold-300 bg-[#f7ecd7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
                      <Sparkles size={14} />
                      Property Studio
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
                      <p className="text-lg font-semibold text-ink-900">Trust-heavy detail pages</p>
                      <p className="mt-3 text-sm leading-7 text-ink-500">
                        Amenities, media, neighborhood insight modules, and premium badges help buyers trust the listing faster.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7">
                  <p className="section-kicker">Lead Funnel</p>
                  <h2 className="mt-2 text-3xl font-semibold text-ink-900">Monitor buyer quality from first enquiry to close</h2>
                  <div className="mt-5 space-y-3">
                    <ProgressBar
                      label="New / pending"
                      count={leadFunnel.grouped.new}
                      total={Math.max(1, leadFunnel.total)}
                      helper="Fresh leads that need first response."
                    />
                    <ProgressBar
                      label="Contacted"
                      count={leadFunnel.grouped.contacted}
                      total={Math.max(1, leadFunnel.total)}
                      helper="Leads already engaged through call or WhatsApp."
                    />
                    <ProgressBar
                      label="Qualified / scheduled"
                      count={leadFunnel.grouped.qualified}
                      total={Math.max(1, leadFunnel.total)}
                      helper="High-intent opportunities moving toward site visits."
                    />
                    <ProgressBar
                      label="Closed / won"
                      count={leadFunnel.grouped.closed}
                      total={Math.max(1, leadFunnel.total)}
                      helper="Revenue-contributing outcomes."
                    />
                  </div>
                </div>
              </div>
            </section>

            <section
              id="inventory"
              className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7"
            >
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

            <section
              id="leads"
              className="rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-ink-900">Lead Management</h2>
                  <p className="mt-2 text-sm leading-7 text-ink-500">
                    Review contact requests, property leads, sell-property submissions, and contract applications in one place.
                  </p>
                </div>
                <div className="rounded-[24px] border border-[#ece2d4] bg-[#fbf8f2] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-ink-500">Lead pool</p>
                  <p className="mt-1 text-2xl font-semibold text-ink-900">{inquiries.length}</p>
                </div>
              </div>

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
