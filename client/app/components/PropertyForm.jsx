import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "../services/api.js";
import { PROPERTY_CATEGORIES, PROPERTY_LISTING_TYPES } from "../utils/format.js";

const baseForm = {
  title: "",
  type: "Plot",
  listingType: "sale",
  price: "",
  location: "",
  contactPhone: "",
  description: ""
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
    location: property.location?.address || property.location?.city || "",
    contactPhone: property.contactPhone || "",
    description: property.description || ""
  };
};

const PropertyForm = ({ initialProperty, onSubmit, isSubmitting, onCancel }) => {
  const [form, setForm] = useState(() => mapPropertyToForm(initialProperty));
  const [existingImages, setExistingImages] = useState(initialProperty?.images || []);
  const [newImages, setNewImages] = useState([]);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(mapPropertyToForm(initialProperty));
    setExistingImages(initialProperty?.images || []);
    setNewImages([]);
    setValidationError("");
  }, [initialProperty]);

  const previews = useMemo(
    () =>
      newImages.map((file) => ({
        key: `${file.name}-${file.lastModified}`,
        url: URL.createObjectURL(file)
      })),
    [newImages]
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      setNewImages((current) => [...current, ...selectedFiles].slice(0, 10));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!initialProperty && existingImages.length === 0 && newImages.length === 0) {
      setValidationError("Add at least one property image before publishing.");
      return;
    }

    setValidationError("");

    await onSubmit({
      ...form,
      images: newImages,
      retainedImages: existingImages
    });

    if (!initialProperty) {
      setForm(baseForm);
      setExistingImages([]);
      setNewImages([]);
    }
  };

  return (
    <form className="card space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="section-kicker">Property Studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink-800">
            {initialProperty ? "Edit Property" : "Add Property"}
          </h2>
          <p className="mt-2 text-sm text-ink-500">
            Create clean, verified-looking listings with title, price, location, image, and type.
          </p>
        </div>

        {initialProperty ? (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel Edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink-600">Title</span>
          <input className="input-field" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink-600">Type</span>
          <select className="input-field" name="type" value={form.type} onChange={handleChange}>
            {PROPERTY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink-600">Listing Mode</span>
          <select className="input-field" name="listingType" value={form.listingType} onChange={handleChange}>
            {PROPERTY_LISTING_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink-600">Price (INR)</span>
          <input
            className="input-field"
            type="number"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink-600">Location</span>
          <input
            className="input-field"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Makronia, Civil Line, Sagar"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-ink-600">Contact Phone</span>
          <input
            className="input-field"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            placeholder="Optional"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink-600">Description</span>
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

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink-800">Images</h3>
            <p className="text-sm text-ink-500">Upload polished building, plot, or construction visuals.</p>
          </div>
          <label className="btn-secondary cursor-pointer">
            <ImagePlus size={16} />
            Add Images
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageSelect} />
          </label>
        </div>

        {existingImages.length > 0 || previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {existingImages.map((image) => (
              <div key={image.filename} className="relative overflow-hidden rounded-3xl border border-brand-100 bg-cream-100">
                <img
                  src={resolveImageUrl(image.url)}
                  alt="Property"
                  className="h-28 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.filename)}
                  className="absolute right-2 top-2 rounded-full bg-ink-900/80 p-2 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {previews.map((preview) => (
              <div key={preview.key} className="relative overflow-hidden rounded-3xl border border-brand-100 bg-cream-100">
                <img
                  src={preview.url}
                  alt="Preview"
                  className="h-28 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(preview.key)}
                  className="absolute right-2 top-2 rounded-full bg-ink-900/80 p-2 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        {validationError ? <p className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{validationError}</p> : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialProperty ? "Update Property" : "Publish Property"}
        </button>
        <p className="text-sm text-ink-500">Cards auto-resize across mobile, tablet, and desktop grids.</p>
      </div>
    </form>
  );
};

export default PropertyForm;
