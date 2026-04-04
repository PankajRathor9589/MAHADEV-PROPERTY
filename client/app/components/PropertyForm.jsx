import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "../services/api.js";
import { PROPERTY_CATEGORIES } from "../utils/format.js";

const baseForm = {
  title: "",
  listingType: "sale",
  category: "Apartment",
  price: "",
  area: "",
  bedrooms: 2,
  bathrooms: 2,
  city: "",
  state: "",
  address: "",
  landmark: "",
  pincode: "",
  latitude: "",
  longitude: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  amenities: "",
  description: ""
};

const mapPropertyToForm = (property) => {
  if (!property) {
    return baseForm;
  }

  return {
    title: property.title || "",
    listingType: property.listingType || "sale",
    category: property.category || "Apartment",
    price: property.price || "",
    area: property.area || "",
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 0,
    city: property.location?.city || "",
    state: property.location?.state || "",
    address: property.location?.address || "",
    landmark: property.location?.landmark || "",
    pincode: property.location?.pincode || "",
    latitude: property.location?.coordinates?.lat ?? "",
    longitude: property.location?.coordinates?.lng ?? "",
    contactName: property.contactName || "",
    contactEmail: property.contactEmail || "",
    contactPhone: property.contactPhone || "",
    amenities: (property.amenities || []).join(", "),
    description: property.description || ""
  };
};

const PropertyForm = ({ initialProperty, onSubmit, isSubmitting, onCancel }) => {
  const [form, setForm] = useState(() => mapPropertyToForm(initialProperty));
  const [existingImages, setExistingImages] = useState(initialProperty?.images || []);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    setForm(mapPropertyToForm(initialProperty));
    setExistingImages(initialProperty?.images || []);
    setNewImages([]);
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
      setNewImages((current) => [...current, ...selectedFiles]);
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

    await onSubmit({
      ...form,
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-200/80">Listing Studio</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {initialProperty ? "Edit Property" : "Add a New Property"}
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Fill in the listing details, upload images, and manage the live property inventory.
          </p>
        </div>

        {initialProperty ? (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Property Title</span>
          <input className="input-field" name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Listing Type</span>
          <select className="input-field" name="listingType" value={form.listingType} onChange={handleChange}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Category</span>
          <select className="input-field" name="category" value={form.category} onChange={handleChange}>
            {PROPERTY_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Price (INR)</span>
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

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Area (sq.ft)</span>
          <input
            className="input-field"
            type="number"
            min="0"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Bedrooms</span>
          <input
            className="input-field"
            type="number"
            min="0"
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Bathrooms</span>
          <input
            className="input-field"
            type="number"
            min="0"
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">City</span>
          <input className="input-field" name="city" value={form.city} onChange={handleChange} required />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">State</span>
          <input className="input-field" name="state" value={form.state} onChange={handleChange} required />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white/80">Address</span>
          <input className="input-field" name="address" value={form.address} onChange={handleChange} required />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Landmark</span>
          <input className="input-field" name="landmark" value={form.landmark} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Pincode</span>
          <input className="input-field" name="pincode" value={form.pincode} onChange={handleChange} />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Latitude</span>
          <input
            className="input-field"
            type="number"
            step="any"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Longitude</span>
          <input
            className="input-field"
            type="number"
            step="any"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Contact Name</span>
          <input
            className="input-field"
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-white/80">Contact Phone</span>
          <input
            className="input-field"
            name="contactPhone"
            value={form.contactPhone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white/80">Contact Email</span>
          <input
            className="input-field"
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white/80">Amenities</span>
          <input
            className="input-field"
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="Parking, Lift, Security, Club house"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-white/80">Description</span>
          <textarea
            className="textarea-field"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Images</h3>
            <p className="text-sm text-white/60">Upload up to 10 polished property visuals.</p>
          </div>
          <label className="btn-secondary cursor-pointer">
            <ImagePlus size={16} />
            Add photos
            <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageSelect} />
          </label>
        </div>

        {(existingImages.length > 0 || previews.length > 0) && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {existingImages.map((image) => (
              <div key={image.filename} className="relative overflow-hidden rounded-3xl border border-white/12">
                <img src={resolveImageUrl(image.url)} alt="Property" className="h-28 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.filename)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {previews.map((preview) => (
              <div key={preview.key} className="relative overflow-hidden rounded-3xl border border-white/12">
                <img src={preview.url} alt="Preview" className="h-28 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(preview.key)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialProperty ? "Update property" : "Create property"}
        </button>
        <p className="text-sm text-white/55">Approved properties appear publicly in the browse page.</p>
      </div>
    </form>
  );
};

export default PropertyForm;
