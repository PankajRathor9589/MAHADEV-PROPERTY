import { useEffect, useMemo, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { PROPERTY_TYPES } from "../../config/site";

const FieldLabel = ({ children }) => <label className="surface-label">{children}</label>;

const PropertyForm = ({ form, setForm, onSubmit, onCancel, submitting }) => {
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const urls = (form.newImages || []).map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.newImages]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const removeExistingImage = (filename) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((image) => image.filename !== filename)
    }));
  };

  const removeNewImage = (index) => {
    setForm((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, currentIndex) => currentIndex !== index)
    }));
  };

  const allImages = [...form.existingImages, ...previewUrls.map((url, index) => ({ url, filename: `preview-${index}` }))];

  const summary = useMemo(
    () => [
      { label: "Type", value: form.propertyType || "Apartment" },
      { label: "City", value: form.city || "Not set" },
      { label: "Price", value: form.price ? `INR ${Number(form.price).toLocaleString("en-IN")}` : "Not set" },
      { label: "Area", value: form.area ? `${form.area} sq.ft` : "Not set" }
    ],
    [form.area, form.city, form.price, form.propertyType]
  );

  return (
    <form className="panel-card p-6" onSubmit={onSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="surface-label">Property editor</p>
          <h3 className="mt-1 text-2xl font-semibold text-ink">{form.id ? "Edit listing" : "Add new property"}</h3>
          <p className="mt-2 text-sm text-slate-600">
            Update listing details, attach images, and keep the approval team informed with complete property information.
          </p>
        </div>
        {form.status && (
          <span
            className={`status-badge ${
              form.status === "approved" ? "status-approved" : form.status === "rejected" ? "status-rejected" : "status-pending"
            }`}
          >
            {form.status}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[26px] border border-slate-100 bg-slate-50/90 p-5">
            <p className="surface-label">Core details</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="space-y-2 lg:col-span-2">
                <FieldLabel>Property title</FieldLabel>
                <input className="field" required placeholder="Property title" value={form.title} onChange={(event) => updateField("title", event.target.value)} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Property type</FieldLabel>
                <select className="field" value={form.propertyType} onChange={(event) => updateField("propertyType", event.target.value)}>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <FieldLabel>City</FieldLabel>
                <input className="field" required placeholder="City" value={form.city} onChange={(event) => updateField("city", event.target.value)} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Price</FieldLabel>
                <input className="field" required type="number" placeholder="Price" value={form.price} onChange={(event) => updateField("price", event.target.value)} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Area</FieldLabel>
                <input className="field" required type="number" placeholder="Area (sq.ft)" value={form.area} onChange={(event) => updateField("area", event.target.value)} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Bedrooms</FieldLabel>
                <input className="field" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={(event) => updateField("bedrooms", event.target.value)} />
              </div>
              <div className="space-y-2">
                <FieldLabel>Bathrooms</FieldLabel>
                <input className="field" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={(event) => updateField("bathrooms", event.target.value)} />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <FieldLabel>Location / Address</FieldLabel>
                <input className="field" required placeholder="Location / Address" value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-slate-100 bg-slate-50/90 p-5">
            <p className="surface-label">Listing content</p>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <FieldLabel>Description</FieldLabel>
                <textarea
                  className="field min-h-[140px]"
                  required
                  placeholder="Property description"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Amenities</FieldLabel>
                <input
                  className="field"
                  placeholder="Amenities, comma separated"
                  value={form.amenities}
                  onChange={(event) => updateField("amenities", event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-[26px] border border-dashed border-brand-200 bg-brand-50/60 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
                <FaImage />
              </div>
              <div>
                <p className="surface-label">Media upload</p>
                <p className="mt-1 text-sm text-slate-600">Use clean cover images first, then add supporting gallery shots.</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(event) => updateField("newImages", Array.from(event.target.files || []))}
            />

            {allImages.length > 0 && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {form.existingImages.map((image) => (
                  <div key={image.filename} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img src={image.url} alt={form.title || "Existing property image"} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.filename)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img src={url} alt={`${form.title || "Property"} upload ${index + 1}`} className="h-28 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-soft">
            <p className="surface-label">Editing summary</p>
            <h4 className="mt-2 text-2xl font-semibold text-ink">{form.title || "Untitled listing"}</h4>
            <p className="mt-2 text-sm text-slate-600">{form.location || "Add a location so the listing is easier to review."}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {summary.map((item) => (
                <div key={item.label} className="rounded-[22px] bg-slate-50 px-4 py-3">
                  <p className="surface-label">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[26px] border border-white/70 bg-white/90 p-5 shadow-soft">
            <p className="surface-label">Submission checklist</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">Use a clear property title and an exact city/locality combination.</div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">Keep the first uploaded image strong enough to act as the listing cover.</div>
              <div className="rounded-[20px] bg-slate-50 px-4 py-3">Add amenities and description points that help the approval team understand value quickly.</div>
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : form.id ? "Update property" : "Create property"}
        </button>
        {form.id && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
};

export default PropertyForm;
