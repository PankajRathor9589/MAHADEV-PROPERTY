import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import MapPicker from "./MapPicker.jsx";
import { resolveImageUrl } from "../services/api.js";

const propertyTypes = ["Plot", "House", "Flat", "Commercial", "Agricultural Land"];

const baseForm = {
  title: "",
  propertyType: "Plot",
  price: "",
  areaSqFt: "",
  state: "",
  city: "",
  locality: "",
  address: "",
  pincode: "",
  latitude: "",
  longitude: "",
  mapPinUrl: "",
  bedrooms: 0,
  bathrooms: 0,
  parking: false,
  waterSupply: false,
  electricity: false,
  roadAccess: false,
  description: "",
  nearbyPlaces: "",
  contactPhone: "",
  isSold: false,
  listingStatus: "pending"
};

const mapPropertyToForm = (property) => {
  if (!property) {
    return baseForm;
  }

  return {
    title: property.title || "",
    propertyType: property.propertyType || "Plot",
    price: property.price || "",
    areaSqFt: property.areaSqFt || "",
    state: property.location?.state || "",
    city: property.location?.city || "",
    locality: property.location?.locality || "",
    address: property.location?.address || "",
    pincode: property.location?.pincode || "",
    latitude: property.location?.latitude || "",
    longitude: property.location?.longitude || "",
    mapPinUrl: property.location?.mapPinUrl || "",
    bedrooms: property.features?.bedrooms ?? 0,
    bathrooms: property.features?.bathrooms ?? 0,
    parking: Boolean(property.features?.parking),
    waterSupply: Boolean(property.features?.waterSupply),
    electricity: Boolean(property.features?.electricity),
    roadAccess: Boolean(property.features?.roadAccess),
    description: property.description || "",
    nearbyPlaces: (property.nearbyPlaces || []).join(", "),
    contactPhone: property.contactPhone || "",
    isSold: Boolean(property.isSold),
    listingStatus: property.listingStatus || "pending"
  };
};

const PropertyForm = ({
  initialProperty,
  onSubmit,
  isSubmitting,
  onCancel,
  showApprovalControls = false
}) => {
  const [form, setForm] = useState(() => mapPropertyToForm(initialProperty));
  const [existingImages, setExistingImages] = useState(initialProperty?.images || []);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    setForm(mapPropertyToForm(initialProperty));
    setExistingImages(initialProperty?.images || []);
    setNewImages([]);
  }, [initialProperty]);

  const previewUrls = useMemo(() => {
    return newImages.map((file) => ({
      key: `${file.name}-${file.lastModified}`,
      url: URL.createObjectURL(file)
    }));
  }, [newImages]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previewUrls]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleMapChange = ({ latitude, longitude }) => {
    setForm((prev) => ({
      ...prev,
      latitude,
      longitude
    }));
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
    }

    event.target.value = "";
  };

  const removeExistingImage = (filename) => {
    setExistingImages((prev) => prev.filter((image) => image.filename !== filename));
  };

  const removeNewImage = (key) => {
    setNewImages((prev) => prev.filter((file) => `${file.name}-${file.lastModified}` !== key));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      nearbyPlaces: form.nearbyPlaces
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: newImages,
      retainedImages: existingImages
    };

    await onSubmit(payload);

    if (!initialProperty) {
      setForm(baseForm);
      setExistingImages([]);
      setNewImages([]);
    }
  };

  const allImagesCount = existingImages.length + newImages.length;

  return (
    <form className="card space-y-5" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {initialProperty ? "Edit Property" : "Add Property"}
          </h2>
          <p className="text-sm text-slate-500">Submit complete listing details with map pin and photos.</p>
        </div>

        {initialProperty && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basic Details</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Property Title *</span>
            <input name="title" value={form.title} onChange={handleChange} className="input-field" required />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Property Type *</span>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              className="input-field"
              required
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Price (INR) *</span>
            <input
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input-field"
              required
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Area (sq ft) *</span>
            <input
              type="number"
              min="0"
              name="areaSqFt"
              value={form.areaSqFt}
              onChange={handleChange}
              className="input-field"
              required
            />
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Location</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">State *</span>
            <input name="state" value={form.state} onChange={handleChange} className="input-field" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">City *</span>
            <input name="city" value={form.city} onChange={handleChange} className="input-field" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Locality *</span>
            <input name="locality" value={form.locality} onChange={handleChange} className="input-field" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Pincode *</span>
            <input name="pincode" value={form.pincode} onChange={handleChange} className="input-field" required />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Full Address *</span>
            <input name="address" value={form.address} onChange={handleChange} className="input-field" required />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Latitude *</span>
            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="input-field"
              required
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Longitude *</span>
            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="input-field"
              required
            />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">Google Map Pin URL (optional)</span>
            <input
              name="mapPinUrl"
              value={form.mapPinUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://maps.google.com/..."
            />
          </label>
        </div>

        <MapPicker latitude={form.latitude} longitude={form.longitude} onChange={handleMapChange} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Property Features</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Bedrooms</span>
            <input
              type="number"
              min="0"
              name="bedrooms"
              value={form.bedrooms}
              onChange={handleChange}
              className="input-field"
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Bathrooms</span>
            <input
              type="number"
              min="0"
              name="bathrooms"
              value={form.bathrooms}
              onChange={handleChange}
              className="input-field"
            />
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-slate-700">
            <input type="checkbox" name="parking" checked={form.parking} onChange={handleChange} /> Parking
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-slate-700">
            <input type="checkbox" name="waterSupply" checked={form.waterSupply} onChange={handleChange} />
            Water
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-slate-700">
            <input type="checkbox" name="electricity" checked={form.electricity} onChange={handleChange} />
            Electricity
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-slate-700">
            <input type="checkbox" name="roadAccess" checked={form.roadAccess} onChange={handleChange} />
            Road Access
          </label>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Media Upload</h3>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm font-medium text-slate-600 hover:border-brand-500 hover:text-brand-600">
          <ImagePlus size={18} /> Upload property images
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageSelect} />
        </label>
        <p className="text-xs text-slate-500">Total selected images: {allImagesCount}</p>

        {(existingImages.length > 0 || previewUrls.length > 0) && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {existingImages.map((image) => (
              <div key={image.filename} className="relative overflow-hidden rounded-lg border border-slate-300">
                <img src={resolveImageUrl(image.url)} alt="Property" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.filename)}
                  className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {previewUrls.map((preview) => (
              <div key={preview.key} className="relative overflow-hidden rounded-lg border border-slate-300">
                <img src={preview.url} alt="Preview" className="h-32 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(preview.key)}
                  className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Description</h3>
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">Detailed Description *</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="textarea-field"
            required
          />
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium text-slate-700">Nearby Places (comma-separated)</span>
          <textarea
            name="nearbyPlaces"
            value={form.nearbyPlaces}
            onChange={handleChange}
            className="textarea-field"
            placeholder="School, Hospital, Market"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">Contact Phone</span>
            <input
              name="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className="input-field"
              placeholder="919876543210"
            />
          </label>
          <label className="flex items-center gap-2 pt-8 text-sm font-medium text-slate-700">
            <input type="checkbox" name="isSold" checked={form.isSold} onChange={handleChange} /> Mark as sold
          </label>
        </div>
      </section>

      {showApprovalControls && (
        <section className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Admin Listing Status</h3>
          <select
            name="listingStatus"
            value={form.listingStatus}
            onChange={handleChange}
            className="input-field max-w-sm"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </section>
      )}

      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialProperty ? "Update Property" : "Create Property"}
      </button>
    </form>
  );
};

export default PropertyForm;
