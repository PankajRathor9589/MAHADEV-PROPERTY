import { Clapperboard, ImagePlus, Link2, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "../services/api.js";
import {
  normalizePropertyImageEntries,
  normalizePropertyVideoEntries,
  PROPERTY_CATEGORIES,
  PROPERTY_LISTING_TYPES
} from "../utils/format.js";
import MediaPlayer from "./MediaPlayer.jsx";

const baseForm = {
  title: "",
  type: "Plot",
  listingType: "sale",
  price: "",
  address: "",
  city: "Sagar",
  state: "Madhya Pradesh",
  landmark: "",
  pincode: "",
  area: "",
  bedrooms: "",
  bathrooms: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  amenitiesText: "",
  description: "",
  youtubeUrl: "",
  videoTourUrl: "",
  isFeatured: false
};

const mapPropertyToForm = (property) => {
  if (!property) {
    return baseForm;
  }

  return {
    title: property.title || "",
    type: property.category || "Plot",
    listingType: property.listingType || "sale",
    price: property.price || "",
    address: property.location?.address || "",
    city: property.location?.city || "Sagar",
    state: property.location?.state || "Madhya Pradesh",
    landmark: property.location?.landmark || "",
    pincode: property.location?.pincode || "",
    area: property.area || "",
    bedrooms: property.bedrooms || "",
    bathrooms: property.bathrooms || "",
    contactName: property.contactName || property.postedBy?.name || "",
    contactEmail: property.contactEmail || property.postedBy?.email || "",
    contactPhone: property.contactPhone || "",
    amenitiesText: Array.isArray(property.amenities) ? property.amenities.join(", ") : "",
    description: property.description || "",
    youtubeUrl: property.youtubeUrl || "",
    videoTourUrl: property.videoTourUrl || "",
    isFeatured: Boolean(property.isFeatured)
  };
};

const PropertyForm = ({ initialProperty, onSubmit, isSubmitting, onCancel }) => {
  const [form, setForm] = useState(() => mapPropertyToForm(initialProperty));
  const [existingImages, setExistingImages] = useState(() => normalizePropertyImageEntries(initialProperty || {}));
  const [existingVideos, setExistingVideos] = useState(() => normalizePropertyVideoEntries(initialProperty || {}));
  const [newImages, setNewImages] = useState([]);
  const [newVideos, setNewVideos] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(mapPropertyToForm(initialProperty));
    setExistingImages(normalizePropertyImageEntries(initialProperty || {}));
    setExistingVideos(normalizePropertyVideoEntries(initialProperty || {}));
    setNewImages([]);
    setNewVideos([]);
    setValidationError("");
  }, [initialProperty]);

  const imagePreviews = useMemo(
    () =>
      newImages.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file)
      })),
    [newImages]
  );

  const videoPreviews = useMemo(
    () =>
      newVideos.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file),
        label: file.name,
        type: "video"
      })),
    [newVideos]
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      videoPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews, videoPreviews]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      setNewImages((current) => [...current, ...selectedFiles].slice(0, 12));
      setValidationError("");
    }

    event.target.value = "";
  };

  const handleVideoSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      setNewVideos((current) => [...current, ...selectedFiles].slice(0, 4));
      setValidationError("");
    }

    event.target.value = "";
  };

  const removeNewImage = (key) => {
    setNewImages((current) => current.filter((file) => `${file.name}-${file.lastModified}` !== key));
  };

  const removeExistingImage = (filename) => {
    setExistingImages((current) => current.filter((image) => image.filename !== filename));
  };

  const removeNewVideo = (key) => {
    setNewVideos((current) => current.filter((file) => `${file.name}-${file.lastModified}` !== key));
  };

  const removeExistingVideo = (url) => {
    setExistingVideos((current) => current.filter((entry) => entry.url !== url));
  };

  const totalGalleryCount = existingImages.length + newImages.length;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!initialProperty && totalGalleryCount === 0) {
      setValidationError("Add at least one property image before publishing.");
      return;
    }

    setValidationError("");

    const amenities = form.amenitiesText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    await onSubmit({
      ...form,
      location: form.address || form.city,
      amenities,
      images: newImages,
      retainedImages: existingImages,
      videoFiles: newVideos,
      retainedVideos: existingVideos.filter((entry) => entry.type === "video").map((entry) => entry.url),
      retainedVideoMedia: existingVideos.filter((entry) => entry.type === "video")
    });

    if (!initialProperty) {
      setForm(baseForm);
      setExistingImages([]);
      setExistingVideos([]);
      setNewImages([]);
      setNewVideos([]);
    }
  };

  const summary = [
    { label: "Listing type", value: form.listingType === "rent" ? "Rent" : "Sale" },
    { label: "Property type", value: form.type || "Plot" },
    { label: "Featured tag", value: form.isFeatured ? "Featured" : "Standard" },
    { label: "Gallery", value: `${totalGalleryCount} image(s)` },
    { label: "Video", value: `${existingVideos.length + newVideos.length} media item(s)` },
    { label: "Area", value: form.area ? `${form.area} sq.ft` : "Pending" },
    {
      label: "Amenities",
      value: form.amenitiesText ? `${form.amenitiesText.split(/[\n,]+/).filter(Boolean).length} added` : "Pending"
    }
  ];

  const videoShowcaseItems = [
    ...existingVideos,
    ...videoPreviews.map((preview) => ({
      type: "video",
      url: preview.url,
      label: preview.label,
      key: preview.key
    }))
  ];

  return (
    <form className="space-y-6 rounded-[32px] border border-[#eadfcf] bg-white p-6 shadow-[0_20px_58px_rgba(15,23,42,0.08)] sm:p-7" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Property Studio</p>
          <h2 className="mt-2 text-3xl font-semibold text-ink-900">{initialProperty ? "Edit Property" : "Add Property"}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-500">
            Create polished listings with stronger location detail, amenities, and builder-grade property information.
          </p>
        </div>

        {initialProperty ? (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel Edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
            <p className="section-kicker">Core Details</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-ink-700">Title</span>
                <input className="input-field" name="title" value={form.title} onChange={handleChange} required />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Type</span>
                <select className="input-field" name="type" value={form.type} onChange={handleChange}>
                  {PROPERTY_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Listing Mode</span>
                <select className="input-field" name="listingType" value={form.listingType} onChange={handleChange}>
                  {PROPERTY_LISTING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Price (INR)</span>
                <input className="input-field" type="number" min="0" name="price" value={form.price} onChange={handleChange} required />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Area (sq.ft)</span>
                <input className="input-field" type="number" min="0" name="area" value={form.area} onChange={handleChange} />
              </label>

              <label className="flex min-h-[54px] items-center gap-3 rounded-[20px] border border-[#ded4c7] bg-white px-4 py-3.5">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-[#ded4c7] accent-[#d4af37]"
                />
                <span>
                  <span className="block text-sm font-semibold text-ink-700">Featured Tag</span>
                  <span className="block text-xs text-ink-500">Show in premium featured sections</span>
                </span>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Bedrooms</span>
                <input className="input-field" type="number" min="0" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Bathrooms</span>
                <input className="input-field" type="number" min="0" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-ink-700">Description</span>
                <textarea
                  className="textarea-field"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Highlight price, access, locality, and buyer value."
                  required
                />
              </label>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
            <p className="section-kicker">Location & Contact</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-ink-700">Address</span>
                <input
                  className="input-field"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Makronia, Civil Line, Sagar"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">City</span>
                <input className="input-field" name="city" value={form.city} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">State</span>
                <input className="input-field" name="state" value={form.state} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Landmark</span>
                <input className="input-field" name="landmark" value={form.landmark} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Pincode</span>
                <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Contact Name</span>
                <input className="input-field" name="contactName" value={form.contactName} onChange={handleChange} />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-ink-700">Contact Phone</span>
                <input className="input-field" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-ink-700">Contact Email</span>
                <input className="input-field" type="email" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-ink-700">Amenities</span>
                <textarea
                  className="textarea-field"
                  name="amenitiesText"
                  value={form.amenitiesText}
                  onChange={handleChange}
                  placeholder="Security, Parking, Garden, Road access"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[30px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Image Gallery</p>
                <p className="mt-2 text-sm text-ink-500">Use strong cover shots first, then supporting images.</p>
              </div>
              <label className="btn-secondary cursor-pointer">
                <ImagePlus size={16} />
                Add Images
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageSelect} />
              </label>
            </div>

            {existingImages.length > 0 || imagePreviews.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {existingImages.map((image) => (
                  <div key={image.filename} className="relative overflow-hidden rounded-[24px] border border-[#e8dccb] bg-white">
                    <img
                      src={resolveImageUrl(image.url, { width: 640, height: 480, crop: "fill" })}
                      alt="Property"
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.filename)}
                      className="absolute right-2 top-2 rounded-full bg-white/92 p-2 text-ink-800 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {imagePreviews.map((preview) => (
                  <div key={preview.key} className="relative overflow-hidden rounded-[24px] border border-[#e8dccb] bg-white">
                    <img
                      src={preview.url}
                      alt="Preview"
                      className="aspect-[4/3] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(preview.key)}
                      className="absolute right-2 top-2 rounded-full bg-white/92 p-2 text-ink-800 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          <section className="rounded-[30px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Video Media</p>
                <p className="mt-2 text-sm text-ink-500">Add an uploaded walkthrough, a direct hosted video URL, or a YouTube tour link.</p>
              </div>
              <label className="btn-secondary cursor-pointer">
                <UploadCloud size={16} />
                Upload Video
                <input type="file" className="hidden" accept="video/*" multiple onChange={handleVideoSelect} />
              </label>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700">
                  <Clapperboard size={15} className="text-gold-600" />
                  Uploaded Video URL
                </span>
                <input
                  className="input-field"
                  name="videoTourUrl"
                  value={form.videoTourUrl}
                  onChange={handleChange}
                  placeholder="https://your-video-host/video.mp4"
                />
              </label>

              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700">
                  <Link2 size={15} className="text-gold-600" />
                  YouTube Link
                </span>
                <input
                  className="input-field"
                  name="youtubeUrl"
                  value={form.youtubeUrl}
                  onChange={handleChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </label>
            </div>

            {videoShowcaseItems.length > 0 ? (
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {videoShowcaseItems.map((item, index) => (
                  <div key={`${item.url}-${index}`} className="space-y-3 rounded-[26px] border border-[#e8dccb] bg-white p-3">
                    <MediaPlayer item={item} title={`Property video ${index + 1}`} roundedClassName="rounded-[22px]" />
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-ink-600">
                        {item.label || (item.type === "youtube" ? "YouTube Tour" : `Video ${index + 1}`)}
                      </p>
                      <button
                        type="button"
                        onClick={() => (item.key ? removeNewVideo(item.key) : removeExistingVideo(item.url))}
                        className="rounded-full bg-[#fbf8f2] p-2 text-ink-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-[30px] border border-[#ece2d4] bg-[#fbf8f2] p-5">
            <p className="section-kicker">Editing Summary</p>
            <h3 className="mt-3 text-3xl font-semibold text-ink-900">{form.title || "Untitled listing"}</h3>
            <p className="mt-2 text-sm leading-7 text-ink-500">
              {form.address || form.city || "Add a location so the listing feels complete and review-ready."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {summary.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-[#e8dccb] bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-700">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-ink-900">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[30px] border border-gold-300/40 bg-[#fbf2df] p-5">
            <p className="section-kicker">Submission Checklist</p>
            <div className="mt-4 grid gap-3 text-sm text-ink-600">
              <div className="rounded-[20px] border border-[#eadfcf] bg-white px-4 py-3">
                Use a strong title, exact address, and a clean first image because the first card impression matters most.
              </div>
              <div className="rounded-[20px] border border-[#eadfcf] bg-white px-4 py-3">
                Add amenities, area, and room counts whenever available so the builder-grade detail page feels complete.
              </div>
              <div className="rounded-[20px] border border-[#eadfcf] bg-white px-4 py-3">
                Add a YouTube link or uploaded video when you want the detail page to feel more immersive on mobile and desktop.
              </div>
            </div>
          </section>
        </aside>
      </div>

      {validationError ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{validationError}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialProperty ? "Update Property" : "Publish Property"}
        </button>
        <p className="text-sm text-ink-500">Responsive gallery, video, and layout previews update automatically as you edit.</p>
      </div>
    </form>
  );
};

export default PropertyForm;
