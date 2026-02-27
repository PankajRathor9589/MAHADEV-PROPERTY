import { useEffect, useState } from "react";
import { adminApi, alertApi, inquiryApi, propertyApi, reportApi, reviewApi, uploadApi } from "../api/services";
import { AREA_UNITS, LAND_STATUS_OPTIONS, OWNER_PROFILE, PROPERTY_TYPES, SERVICE_AREA } from "../config/site";
import Seo from "../components/ui/Seo";

const defaultProperty = {
  title: "",
  price: "",
  listingType: "Sale",
  propertyType: "Plot",
  areaValue: "",
  areaUnit: "sqft",
  bedrooms: 0,
  bathrooms: 0,
  availabilityStatus: "Available",
  landStatus: "Open Land",
  recentlySold: false,
  isFeatured: false,
  isTrending: false,
  description: "",
  highlights: "",
  nearbyPlaces: "",
  images: "",
  videos: "",
  floorPlanImage: "",
  youtubeUrl: "",
  district: "Sagar",
  tehsil: "",
  village: "",
  city: "Sagar",
  locality: "",
  pincode: "",
  address: "",
  lat: "",
  lng: ""
};

const toTextList = (value) => value.split(",").map((entry) => entry.trim()).filter(Boolean);
const toText = (arr = []) => arr.join(", ");

const mapPropertyToForm = (item) => ({
  title: item.title || "",
  price: item.price || "",
  listingType: item.listingType || "Sale",
  propertyType: item.propertyType || "Plot",
  areaValue: item.areaValue || item.areaSqft || "",
  areaUnit: item.areaUnit || "sqft",
  bedrooms: item.bedrooms || 0,
  bathrooms: item.bathrooms || 0,
  availabilityStatus: item.availabilityStatus || "Available",
  landStatus: item.landStatus || "Open Land",
  recentlySold: Boolean(item.recentlySold),
  isFeatured: Boolean(item.isFeatured),
  isTrending: Boolean(item.isTrending),
  description: item.description || "",
  highlights: toText(item.highlights),
  nearbyPlaces: toText(item.nearbyPlaces),
  images: toText(item.images),
  videos: toText(item.videos),
  floorPlanImage: item.floorPlanImage || "",
  youtubeUrl: item.youtubeUrl || item.videoTourUrl || "",
  district: item.location?.district || "Sagar",
  tehsil: item.location?.tehsil || "",
  village: item.location?.village || "",
  city: item.location?.city || "Sagar",
  locality: item.location?.locality || "",
  pincode: item.location?.pincode || "",
  address: item.location?.address || "",
  lat: item.location?.coordinates?.lat || "",
  lng: item.location?.coordinates?.lng || ""
});

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [form, setForm] = useState(defaultProperty);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [s, p, i, r, a] = await Promise.all([
      adminApi.stats(),
      propertyApi.list({ limit: 60 }),
      inquiryApi.list(),
      reportApi.list(),
      alertApi.list()
    ]);

    setStats(s.data);
    setProperties(p.data.items || []);
    setInquiries(i.data.items || []);
    setReports(r.data.items || []);
    setAlerts(a.data.items || []);

    const reviewSets = await Promise.all(
      (p.data.items || []).slice(0, 10).map((x) => reviewApi.list(x._id).catch(() => ({ data: { items: [] } })))
    );
    setReviews(reviewSets.flatMap((x) => x.data.items));
  };

  useEffect(() => {
    load();
  }, []);

  const uploadFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const { data } = await uploadApi.media(files);
      const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "");
      const imageUrls = [];
      const videoUrls = [];

      data.items.forEach((entry) => {
        const absolute = `${base}${entry.path}`;
        if (entry.type === "video") videoUrls.push(absolute);
        else imageUrls.push(absolute);
      });

      setForm((prev) => ({
        ...prev,
        images: [prev.images, ...imageUrls].filter(Boolean).join(","),
        videos: [prev.videos, ...videoUrls].filter(Boolean).join(",")
      }));
    } finally {
      setUploading(false);
    }
  };

  const buildPayload = () => ({
    title: form.title,
    price: Number(form.price),
    listingType: form.listingType,
    propertyType: form.propertyType,
    areaValue: Number(form.areaValue),
    areaUnit: form.areaUnit,
    bedrooms: Number(form.bedrooms),
    bathrooms: Number(form.bathrooms),
    availabilityStatus: form.availabilityStatus,
    landStatus: form.landStatus,
    recentlySold: Boolean(form.recentlySold),
    isFeatured: Boolean(form.isFeatured),
    isTrending: Boolean(form.isTrending),
    description: form.description,
    highlights: toTextList(form.highlights),
    nearbyPlaces: toTextList(form.nearbyPlaces),
    images: toTextList(form.images),
    videos: toTextList(form.videos),
    floorPlanImage: form.floorPlanImage,
    youtubeUrl: form.youtubeUrl,
    videoTourUrl: form.youtubeUrl,
    location: {
      district: form.district,
      tehsil: form.tehsil,
      village: form.village,
      city: form.city,
      locality: form.locality,
      pincode: form.pincode,
      address: form.address,
      coordinates: { lat: Number(form.lat), lng: Number(form.lng) }
    },
    dealer: {
      name: OWNER_PROFILE.name,
      photo: OWNER_PROFILE.photo,
      agencyName: "Mahadev Property",
      phone: OWNER_PROFILE.phoneRaw,
      whatsapp: OWNER_PROFILE.whatsappRaw,
      officeAddress: OWNER_PROFILE.address,
      experienceYears: OWNER_PROFILE.experienceYears,
      rating: 4.9,
      isVerified: true
    }
  });

  const saveProperty = async (e) => {
    e.preventDefault();
    const payload = buildPayload();

    if (editingId) {
      await propertyApi.update(editingId, payload);
    } else {
      await propertyApi.create(payload);
    }

    setForm(defaultProperty);
    setEditingId(null);
    await load();
  };

  const editProperty = (item) => {
    setForm(mapPropertyToForm(item));
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Seo title="Admin Dashboard" />
      <h1 className="section-title">Admin Dashboard</h1>
      {stats && (
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="card"><p className="text-sm">Total Properties</p><p className="text-2xl font-bold">{stats.totals.totalProperties}</p></div>
          <div className="card"><p className="text-sm">Total Leads</p><p className="text-2xl font-bold">{stats.totals.totalLeads}</p></div>
          <div className="card"><p className="text-sm">Active Alerts</p><p className="text-2xl font-bold">{stats.totals.totalAlerts || 0}</p></div>
          <div className="card"><p className="text-sm">Open Reports</p><p className="text-2xl font-bold">{stats.totals.openReports}</p></div>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold">{editingId ? "Edit Property" : "Add New Property"}</h2>
        <form className="mt-3 grid gap-3 rounded-2xl bg-white p-4" onSubmit={saveProperty}>
          <div className="grid gap-3 md:grid-cols-4">
            <input className="input" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="input" value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })}><option>Sale</option><option>Rent</option></select>
            <select className="input" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
              {PROPERTY_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
            <input className="input" required type="number" step="0.01" placeholder="Area Value" value={form.areaValue} onChange={(e) => setForm({ ...form, areaValue: e.target.value })} />
            <select className="input" value={form.areaUnit} onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}>
              {AREA_UNITS.map((unit) => <option key={unit} value={unit}>{unit === "acre" ? "Acres" : "Sq.ft"}</option>)}
            </select>
            <select className="input" value={form.landStatus} onChange={(e) => setForm({ ...form, landStatus: e.target.value })}>
              {LAND_STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
            </select>
            <select className="input" value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}><option>Available</option><option>Sold</option><option>Rented</option></select>
            <input className="input" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            <input className="input" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            <select className="input" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>
              {SERVICE_AREA.divisionDistricts.map((district) => <option key={district}>{district}</option>)}
            </select>
            <input className="input" required placeholder="Tehsil" value={form.tehsil} onChange={(e) => setForm({ ...form, tehsil: e.target.value })} />
            <input className="input" placeholder="Village" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} />
            <input className="input" required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className="input" required placeholder="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
            <input className="input" required placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            <input className="input md:col-span-2" required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="input" required type="number" step="0.0001" placeholder="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <input className="input" required type="number" step="0.0001" placeholder="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isTrending} onChange={(e) => setForm({ ...form, isTrending: e.target.checked })} /> Trending</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.recentlySold} onChange={(e) => setForm({ ...form, recentlySold: e.target.checked })} /> Recently Sold</label>
          </div>

          <textarea className="input min-h-24" required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input" placeholder="Highlights comma separated" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
          <input className="input" placeholder="Nearby places comma separated" value={form.nearbyPlaces} onChange={(e) => setForm({ ...form, nearbyPlaces: e.target.value })} />
          <input className="input" placeholder="Image URLs comma separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          <input className="input" placeholder="Video URLs comma separated" value={form.videos} onChange={(e) => setForm({ ...form, videos: e.target.value })} />
          <input className="input" type="file" accept="image/*,video/*" multiple onChange={uploadFiles} />
          {uploading && <p className="text-sm text-slate-500">Uploading media...</p>}
          <input className="input" placeholder="Floor plan URL" value={form.floorPlanImage} onChange={(e) => setForm({ ...form, floorPlanImage: e.target.value })} />
          <input className="input" placeholder="YouTube URL" value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />

          <div className="flex flex-wrap gap-2">
            <button className="btn-primary">{editingId ? "Update Property" : "Create Property"}</button>
            {editingId && (
              <button type="button" className="btn-outline" onClick={() => {
                setEditingId(null);
                setForm(defaultProperty);
              }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Properties</h2>
        <div className="mt-3 space-y-2">
          {properties.map((item) => (
            <div key={item._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-white p-3 text-sm">
              <p>{item.title} - {item.availabilityStatus} - {item.location?.tehsil}</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn-outline" onClick={() => editProperty(item)}>Edit</button>
                <button className="btn-outline" onClick={() => propertyApi.update(item._id, { availabilityStatus: "Sold", recentlySold: true }).then(load)}>Mark Sold</button>
                <button className="btn-outline" onClick={() => propertyApi.remove(item._id).then(load)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Inquiries / Site Visits</h2>
          <div className="mt-3 space-y-2">
            {inquiries.map((item) => (
              <div key={item._id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{item.name} ({item.phone}) - {item.leadType}</p>
                <p>{item.property?.title}</p>
                <p>Status: {item.status}</p>
                <button className="mt-2 btn-outline" onClick={() => inquiryApi.updateStatus(item._id, "closed").then(load)}>Mark Closed</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">Property Alerts</h2>
          <div className="mt-3 space-y-2">
            {alerts.map((item) => (
              <div key={item._id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{item.name} - {item.email}</p>
                <p>{item.preferredLocation || "Any location"} | {item.propertyType || "Any type"}</p>
                <p>Status: {item.status}</p>
                <button className="mt-2 btn-outline" onClick={() => alertApi.updateStatus(item._id, item.status === "active" ? "paused" : "active").then(load)}>
                  {item.status === "active" ? "Pause Alert" : "Activate Alert"}
                </button>
              </div>
            ))}
            {!alerts.length && <p className="text-sm text-slate-500">No alerts yet.</p>}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Reports</h2>
          <div className="mt-3 space-y-2">
            {reports.map((item) => (
              <div key={item._id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{item.reason} - {item.property?.title}</p>
                <p>{item.details}</p>
                <p>Status: {item.status}</p>
                <button className="mt-2 btn-outline" onClick={() => reportApi.updateStatus(item._id, "resolved").then(load)}>Resolve</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">Recent Reviews</h2>
          <div className="mt-3 space-y-2">
            {reviews.map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm">
                <p>{item.comment || "No comment"} - {item.rating}/5</p>
                <button className="btn-outline" onClick={() => reviewApi.remove(item._id).then(load)}>Delete</button>
              </div>
            ))}
            {!reviews.length && <p className="text-sm text-slate-500">No reviews found.</p>}
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;
