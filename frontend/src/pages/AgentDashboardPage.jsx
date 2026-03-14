import { useEffect, useMemo, useState } from "react";
import {
  FaChartLine,
  FaEnvelopeOpenText,
  FaEye,
  FaPen,
  FaPlus,
  FaRegClock,
  FaTrash
} from "react-icons/fa";
import { agentApi, inquiryApi, propertyApi } from "../api/services";
import {
  AnalyticsAreaCard,
  AnalyticsComparisonBarCard,
  AnalyticsDonutCard
} from "../components/dashboard/AnalyticsCharts";
import PropertyForm from "../components/dashboard/PropertyForm";
import StatsCard from "../components/dashboard/StatsCard";
import Seo from "../components/ui/Seo";
import { ChartSkeleton } from "../components/ui/Skeletons";
import { formatPrice } from "../utils/format";

const createEmptyForm = () => ({
  id: null,
  title: "",
  propertyType: "Apartment",
  price: "",
  location: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  description: "",
  amenities: "",
  status: "",
  existingImages: [],
  newImages: []
});

const mapPropertyToForm = (property) => ({
  id: property.id,
  title: property.title,
  propertyType: property.propertyType,
  price: String(property.price || ""),
  location: property.location,
  city: property.city,
  bedrooms: String(property.bedrooms || ""),
  bathrooms: String(property.bathrooms || ""),
  area: String(property.area || ""),
  description: property.description,
  amenities: property.amenities.join(", "),
  status: property.status,
  existingImages: property.images,
  newImages: []
});

const buildPropertyFormData = (form) => {
  const payload = new FormData();
  payload.append("title", form.title);
  payload.append("propertyType", form.propertyType);
  payload.append("price", form.price);
  payload.append("location", form.location);
  payload.append("city", form.city);
  payload.append("bedrooms", form.bedrooms || "0");
  payload.append("bathrooms", form.bathrooms || "0");
  payload.append("area", form.area);
  payload.append("description", form.description);
  payload.append(
    "amenities",
    JSON.stringify(
      form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );

  if (form.id) {
    payload.append("retainedImages", JSON.stringify(form.existingImages));
  }

  form.newImages.forEach((file) => {
    payload.append("images", file);
  });

  return payload;
};

const monthLabel = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "short"
  }).format(new Date(value));

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short"
  }).format(new Date(value));

const shortenTitle = (title = "") => (title.length > 16 ? `${title.slice(0, 16)}...` : title);

const AgentDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [form, setForm] = useState(createEmptyForm());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [stats, listings, inquiryItems] = await Promise.all([agentApi.analytics(), agentApi.properties(), inquiryApi.list()]);
      setAnalytics(stats.data);
      setProperties(listings);
      setInquiries(inquiryItems);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const payload = buildPropertyFormData(form);

      if (form.id) {
        await propertyApi.update(form.id, payload);
        setFeedback("Property updated and sent for review.");
      } else {
        await propertyApi.create(payload);
        setFeedback("Property created successfully.");
      }

      setForm(createEmptyForm());
      await load();
    } catch (error) {
      setFeedback(error.response?.data?.message || "Unable to save property.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await propertyApi.remove(id);
    await load();
  };

  const handleInquiryStatusChange = async (id, status) => {
    await inquiryApi.updateStatus(id, status);
    await load();
  };

  const totalViews = useMemo(() => properties.reduce((sum, property) => sum + Number(property.views || 0), 0), [properties]);

  const leadMap = useMemo(() => {
    const next = {};

    inquiries.forEach((inquiry) => {
      const propertyId = inquiry.property?.id;
      if (!propertyId) {
        return;
      }

      next[propertyId] = next[propertyId] || { total: 0, new: 0, contacted: 0, closed: 0 };
      next[propertyId].total += 1;
      next[propertyId][inquiry.status] = (next[propertyId][inquiry.status] || 0) + 1;
    });

    return next;
  }, [inquiries]);

  const performanceRows = useMemo(
    () =>
      properties
        .map((property) => ({
          ...property,
          leads: leadMap[property.id]?.total || 0,
          newLeads: leadMap[property.id]?.new || 0
        }))
        .sort((left, right) => right.views - left.views || right.leads - left.leads),
    [leadMap, properties]
  );

  const performanceChart = useMemo(
    () =>
      performanceRows.slice(0, 5).map((property) => ({
        label: shortenTitle(property.title),
        views: property.views || 0,
        leads: property.leads || 0
      })),
    [performanceRows]
  );

  const activityChart = useMemo(() => {
    const monthly = {};

    properties.forEach((property) => {
      const label = monthLabel(property.createdAt || Date.now());
      monthly[label] = monthly[label] || { label, views: 0, inquiries: 0 };
      monthly[label].views += Number(property.views || 0);
    });

    inquiries.forEach((inquiry) => {
      const label = monthLabel(inquiry.createdAt || Date.now());
      monthly[label] = monthly[label] || { label, views: 0, inquiries: 0 };
      monthly[label].inquiries += 1;
    });

    return Object.values(monthly).slice(-6);
  }, [properties, inquiries]);

  const leadStatusChart = useMemo(
    () => [
      { label: "New", value: inquiries.filter((inquiry) => inquiry.status === "new").length },
      { label: "Contacted", value: inquiries.filter((inquiry) => inquiry.status === "contacted").length },
      { label: "Closed", value: inquiries.filter((inquiry) => inquiry.status === "closed").length }
    ],
    [inquiries]
  );

  const recentLeads = useMemo(
    () => [...inquiries].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)).slice(0, 6),
    [inquiries]
  );

  const topPerformer = performanceRows[0] || null;

  return (
    <>
      <Seo title="Agent Dashboard" description="Review listing analytics, property performance, and leads while editing property details from the agent dashboard." />

      <div className="space-y-8">
        <section className="panel-card overflow-hidden p-0">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
            <div>
              <p className="surface-label">Agent dashboard</p>
              <h1 className="section-heading mt-2 text-4xl">Track listing performance, respond to leads, and refine inventory faster</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                The workspace now combines listing analytics, lead visibility, and a more guided property editor so you can move from demand signals to listing updates without switching context.
              </p>
            </div>
            <div className="flex flex-wrap items-start justify-end gap-3">
              <button type="button" className="btn-primary" onClick={() => setForm(createEmptyForm())}>
                <FaPlus />
                New listing
              </button>
            </div>
          </div>
        </section>

        {analytics && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatsCard
              label="Total listings"
              value={analytics.totalProperties || 0}
              tone="brand"
              icon={FaChartLine}
              helper="Live inventory across your workspace"
            />
            <StatsCard
              label="Approved"
              value={analytics.approvedProperties || 0}
              tone="sand"
              icon={FaRegClock}
              helper={`${analytics.pendingProperties || 0} waiting for review`}
            />
            <StatsCard
              label="Total views"
              value={totalViews}
              tone="ink"
              icon={FaEye}
              helper="Audience attention across all active listings"
            />
            <StatsCard
              label="Leads received"
              value={analytics.totalInquiries || 0}
              tone="brand"
              icon={FaEnvelopeOpenText}
              helper={`${analytics.newInquiries || 0} new leads to follow up`}
            />
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
            <AnalyticsComparisonBarCard
              title="Property performance"
              description="Compare visibility and lead generation across your strongest listings."
              data={performanceChart}
              primaryKey="views"
              secondaryKey="leads"
              primaryLabel="Views"
              secondaryLabel="Leads"
            />
            <AnalyticsAreaCard
              title="Views and inquiries trend"
              description="Monthly movement across visibility and incoming demand."
              data={activityChart}
              primaryKey="views"
              secondaryKey="inquiries"
            />
            <div className="space-y-5">
              <AnalyticsDonutCard
                title="Lead pipeline"
                description="See how incoming leads are distributed by response stage."
                data={leadStatusChart}
              />
              <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card">
                <p className="surface-label">Top performer</p>
                {topPerformer ? (
                  <>
                    <h3 className="mt-2 text-2xl font-semibold text-ink">{topPerformer.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{topPerformer.location}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                        <p className="surface-label">Views</p>
                        <p className="mt-2 text-lg font-semibold text-ink">{topPerformer.views || 0}</p>
                      </div>
                      <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                        <p className="surface-label">Leads</p>
                        <p className="mt-2 text-lg font-semibold text-ink">{topPerformer.leads || 0}</p>
                      </div>
                      <div className="rounded-[22px] bg-slate-50 px-4 py-3">
                        <p className="surface-label">Price</p>
                        <p className="mt-2 text-sm font-semibold text-ink">{formatPrice(topPerformer.price)}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">Add listings to start seeing performance highlights.</p>
                )}
              </section>
            </div>
          </div>
        )}

        <PropertyForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setForm(createEmptyForm())}
          submitting={submitting}
        />

        {feedback && (
          <div className="rounded-[22px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {feedback}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="table-grid">
            <div className="flex items-center justify-between px-4 py-5 md:px-6">
              <div>
                <p className="surface-label">Leads received</p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">Recent buyer conversations</h2>
              </div>
              {loading && <p className="text-sm text-slate-500">Refreshing...</p>}
            </div>

            {recentLeads.map((inquiry) => (
              <div key={inquiry.id} className="table-row md:grid-cols-[1fr_1.1fr_0.8fr_0.9fr]">
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
                  <p className="mt-2 text-xs text-slate-400">{formatDate(inquiry.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => handleInquiryStatusChange(inquiry.id, "contacted")}>
                    Contacted
                  </button>
                  <button type="button" className="btn-secondary px-3 py-2" onClick={() => handleInquiryStatusChange(inquiry.id, "closed")}>
                    Close
                  </button>
                </div>
              </div>
            ))}

            {!loading && recentLeads.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-500">No leads yet. Your latest inquiries will appear here.</div>
            )}
          </section>

          <section className="rounded-[28px] border border-white/70 bg-white/88 p-5 shadow-card">
            <p className="surface-label">Property performance leaderboard</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Listings ranked by attention</h2>
            <div className="mt-5 space-y-3">
              {performanceRows.slice(0, 5).map((property, index) => (
                <div key={property.id} className="flex items-center justify-between gap-3 rounded-[22px] bg-slate-50 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">#{index + 1}</p>
                    <p className="truncate font-semibold text-ink">{property.title}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{property.location}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-ink">{property.views || 0} views</p>
                    <p className="mt-1 text-slate-500">{property.leads || 0} leads</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="table-grid">
          <div className="flex items-center justify-between px-4 py-5 md:px-6">
            <div>
              <p className="surface-label">Manage listings</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">Editable inventory table</h2>
            </div>
            {loading && <p className="text-sm text-slate-500">Refreshing...</p>}
          </div>

          <div className="hidden grid-cols-[1.4fr_0.9fr_0.8fr_0.6fr_0.8fr] gap-3 bg-slate-50/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 md:grid">
            <span>Property</span>
            <span>Performance</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {performanceRows.map((property) => (
            <div key={property.id} className="table-row md:grid-cols-[1.4fr_0.9fr_0.8fr_0.6fr_0.8fr]">
              <div>
                <p className="font-semibold text-ink">{property.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {property.propertyType} · {property.location}
                </p>
              </div>
              <div>
                <p className="font-medium text-ink">{property.views || 0} views</p>
                <p className="mt-1 text-xs text-slate-500">{property.leads || 0} leads</p>
              </div>
              <p>{formatPrice(property.price)}</p>
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
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn-secondary px-3 py-2" onClick={() => setForm(mapPropertyToForm(property))}>
                  <FaPen />
                </button>
                <button type="button" className="btn-secondary px-3 py-2" onClick={() => handleDelete(property.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {!loading && performanceRows.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-slate-500">No listings yet. Add your first property above.</div>
          )}
        </section>
      </div>
    </>
  );
};

export default AgentDashboardPage;
