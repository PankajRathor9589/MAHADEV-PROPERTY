import { useEffect, useState } from "react";
import { adminApi, inquiryApi, propertyApi, reportApi, reviewApi, uploadApi } from "../api/services";
import Seo from "../components/ui/Seo";

const defaultProperty = {
  title: "",
  price: "",
  listingType: "Sale",
  propertyType: "Plot",
  areaSqft: "",
  bedrooms: 0,
  bathrooms: 0,
  availabilityStatus: "Available",
  description: "",
  highlights: "",
  nearbyPlaces: "",
  images: "",
  floorPlanImage: "",
  videoTourUrl: "",
  city: "",
  locality: "",
  pincode: "",
  address: "",
  lat: "",
  lng: ""
};

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reports, setReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(defaultProperty);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [s, p, i, r] = await Promise.all([
      adminApi.stats(),
      propertyApi.list({ limit: 50 }),
      inquiryApi.list(),
      reportApi.list()
    ]);

    setStats(s.data);
    setProperties(p.data.items || []);
    setInquiries(i.data.items || []);
    setReports(r.data.items || []);

    const reviewSets = await Promise.all((p.data.items || []).slice(0, 10).map((x) => reviewApi.list(x._id).catch(() => ({ data: { items: [] } }))));
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
      const { data } = await uploadApi.images(files);
      const urls = data.items.map((path) => {
        const base = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/api$/, "");
        return `${base}${path}`;
      });
      setForm((prev) => ({ ...prev, images: [prev.images, ...urls].filter(Boolean).join(",") }));
    } finally {
      setUploading(false);
    }
  };

  const createProperty = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      price: Number(form.price),
      listingType: form.listingType,
      propertyType: form.propertyType,
      areaSqft: Number(form.areaSqft),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      availabilityStatus: form.availabilityStatus,
      description: form.description,
      highlights: form.highlights.split(",").map((x) => x.trim()).filter(Boolean),
      nearbyPlaces: form.nearbyPlaces.split(",").map((x) => x.trim()).filter(Boolean),
      images: form.images.split(",").map((x) => x.trim()).filter(Boolean),
      floorPlanImage: form.floorPlanImage,
      videoTourUrl: form.videoTourUrl,
      location: {
        city: form.city,
        locality: form.locality,
        pincode: form.pincode,
        address: form.address,
        coordinates: { lat: Number(form.lat), lng: Number(form.lng) }
      },
      dealer: {
        name: "Rahul Singh",
        agencyName: "Mahadev Property",
        phone: "9876543210",
        whatsapp: "919876543210",
        officeAddress: "Main Road, Ujjain",
        experienceYears: 12,
        rating: 4.8,
        isVerified: true
      }
    };

    await propertyApi.create(payload);
    setForm(defaultProperty);
    await load();
  };

  const markSold = async (id) => {
    await propertyApi.update(id, { availabilityStatus: "Sold" });
    await load();
  };

  return (
    <>
      <Seo title="Admin Dashboard" />
      <h1 className="section-title">Admin Dashboard</h1>
      {stats && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="card"><p className="text-sm">Total Properties</p><p className="text-2xl font-bold">{stats.totals.totalProperties}</p></div>
          <div className="card"><p className="text-sm">Total Leads</p><p className="text-2xl font-bold">{stats.totals.totalLeads}</p></div>
          <div className="card"><p className="text-sm">Open Reports</p><p className="text-2xl font-bold">{stats.totals.openReports}</p></div>
        </div>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold">Add New Property</h2>
        <form className="mt-3 grid gap-3 rounded-xl bg-white p-4" onSubmit={createProperty}>
          <div className="grid gap-3 md:grid-cols-3">
            <input className="input" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input" required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <select className="input" value={form.listingType} onChange={(e) => setForm({ ...form, listingType: e.target.value })}><option>Sale</option><option>Rent</option></select>
            <select className="input" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}><option>Flat</option><option>Plot</option><option>House</option><option>Commercial</option><option>Agricultural Land</option></select>
            <input className="input" required type="number" placeholder="Area sqft" value={form.areaSqft} onChange={(e) => setForm({ ...form, areaSqft: e.target.value })} />
            <select className="input" value={form.availabilityStatus} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value })}><option>Available</option><option>Sold</option><option>Rented</option></select>
            <input className="input" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            <input className="input" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            <input className="input" required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input className="input" required placeholder="Locality" value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} />
            <input className="input" required placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            <input className="input" required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="input" required type="number" step="0.0001" placeholder="Latitude" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
            <input className="input" required type="number" step="0.0001" placeholder="Longitude" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
          </div>
          <textarea className="input min-h-24" required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="input" placeholder="Highlights comma separated" value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
          <input className="input" placeholder="Nearby places comma separated" value={form.nearbyPlaces} onChange={(e) => setForm({ ...form, nearbyPlaces: e.target.value })} />
          <input className="input" placeholder="Image URLs comma separated" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          <input className="input" type="file" accept="image/*" multiple onChange={uploadFiles} />
          {uploading && <p className="text-sm text-slate-500">Uploading images...</p>}
          <input className="input" placeholder="Floor plan URL" value={form.floorPlanImage} onChange={(e) => setForm({ ...form, floorPlanImage: e.target.value })} />
          <input className="input" placeholder="Video tour URL" value={form.videoTourUrl} onChange={(e) => setForm({ ...form, videoTourUrl: e.target.value })} />
          <button className="btn-primary">Create Property</button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Properties</h2>
        <div className="mt-3 space-y-2">
          {properties.map((p) => (
            <div key={p._id} className="flex flex-wrap items-center justify-between rounded-lg bg-white p-3 text-sm">
              <p>{p.title} - {p.availabilityStatus}</p>
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => markSold(p._id)}>Mark Sold</button>
                <button className="btn-outline" onClick={() => propertyApi.remove(p._id).then(load)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Inquiries / Site Visits</h2>
          <div className="mt-3 space-y-2">
            {inquiries.map((q) => (
              <div key={q._id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{q.name} ({q.phone}) - {q.leadType}</p>
                <p>{q.property?.title}</p>
                <p>Status: {q.status}</p>
                <button className="mt-2 btn-outline" onClick={() => inquiryApi.updateStatus(q._id, "closed").then(load)}>Mark Closed</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">Reports</h2>
          <div className="mt-3 space-y-2">
            {reports.map((r) => (
              <div key={r._id} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-semibold">{r.reason} - {r.property?.title}</p>
                <p>{r.details}</p>
                <p>Status: {r.status}</p>
                <button className="mt-2 btn-outline" onClick={() => reportApi.updateStatus(r._id, "resolved").then(load)}>Resolve</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">Recent Reviews</h2>
        <div className="mt-3 space-y-2">
          {reviews.map((rv) => (
            <div key={rv._id} className="flex items-center justify-between rounded-lg bg-white p-3 text-sm">
              <p>{rv.comment || "No comment"} - {rv.rating}/5</p>
              <button className="btn-outline" onClick={() => reviewApi.remove(rv._id).then(load)}>Delete</button>
            </div>
          ))}
          {!reviews.length && <p className="text-sm text-slate-500">No reviews found.</p>}
        </div>
      </section>
    </>
  );
};

export default AdminPage;
