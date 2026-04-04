import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").trim();
export const API_ORIGIN = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "";
const hasApiBase = Boolean(API_BASE_URL);
const defaultApiMessage = "API is not configured for this deployment. Set VITE_API_URL to enable login, admin, and lead features.";

const http = axios.create({
  baseURL: API_BASE_URL || undefined
});

const getToken = () => localStorage.getItem("sagar_infra_token");

const requireApiBase = (message = defaultApiMessage) => {
  if (!hasApiBase) {
    throw new Error(message);
  }
};

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const parseError = (error) =>
  error?.response?.data?.message ||
  (Array.isArray(error?.response?.data?.details) ? error.response.data.details.join(", ") : "") ||
  error.message ||
  "Request failed";

const buildPropertyFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (["images", "amenities", "retainedImages"].includes(key)) {
      return;
    }

    if (value === undefined || value === null || value === "") {
      return;
    }

    formData.append(key, String(value));
  });

  formData.append("amenities", JSON.stringify(payload.amenities || []));

  if (Array.isArray(payload.retainedImages)) {
    formData.append("retainedImages", JSON.stringify(payload.retainedImages));
  }

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};

export const resolveImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

const safeRequest = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const registerUser = async (payload) => {
  requireApiBase();
  return safeRequest(http.post("/auth/register", payload));
};

export const loginUser = async (payload) => {
  requireApiBase();
  return safeRequest(http.post("/auth/login", payload));
};

export const loginAdminWithKey = async (adminKey) => {
  requireApiBase();
  return safeRequest(http.post("/auth/admin/login", { adminKey }));
};

export const fetchMe = async () => {
  requireApiBase();
  const data = await safeRequest(http.get("/auth/me"));
  return data.user;
};

export const fetchProperties = async (params = {}) => {
  if (!hasApiBase) {
    return { data: [] };
  }

  return safeRequest(http.get("/properties", { params }));
};

export const fetchPropertyById = async (id) => {
  requireApiBase();
  const data = await safeRequest(http.get(`/properties/${id}`));
  return data.data;
};

export const createProperty = async (payload) => {
  requireApiBase();
  const data = await safeRequest(http.post("/properties", buildPropertyFormData(payload)));
  return data.data;
};

export const updateProperty = async (id, payload) => {
  requireApiBase();
  const data = await safeRequest(http.put(`/properties/${id}`, buildPropertyFormData(payload)));
  return data.data;
};

export const deleteProperty = async (id) => {
  requireApiBase();
  return safeRequest(http.delete(`/properties/${id}`));
};

export const updatePropertyApproval = async (id, approvalStatus, rejectionReason = "") => {
  requireApiBase();
  const data = await safeRequest(
    http.patch(`/properties/${id}/approval`, { approvalStatus, rejectionReason })
  );
  return data.data;
};

export const updatePropertyFeatured = async (id, isFeatured, featuredDays = 30) => {
  requireApiBase();
  const data = await safeRequest(
    http.patch(`/properties/${id}/featured`, { isFeatured, featuredDays })
  );
  return data.data;
};

export const submitInquiry = async (propertyId, payload) => {
  requireApiBase();
  const data = await safeRequest(http.post(`/properties/${propertyId}/inquiries`, payload));
  return data.data;
};

export const submitLead = async (payload) => {
  requireApiBase("Online lead submission is not configured yet. Please call or WhatsApp Sagar Infra to continue.");
  const data = await safeRequest(http.post("/inquiries", payload));
  return data.data;
};

export const fetchInquiries = async (params = {}) => {
  requireApiBase();
  return safeRequest(http.get("/inquiries", { params }));
};

export const updateInquiryStatus = async (id, status) => {
  requireApiBase();
  const data = await safeRequest(http.patch(`/inquiries/${id}/status`, { status }));
  return data.data;
};

export const fetchAdminAnalytics = async () => {
  requireApiBase();
  return safeRequest(http.get("/admin/analytics"));
};

export const fetchAdminProperties = async (params = {}) => {
  requireApiBase();
  return safeRequest(http.get("/admin/properties", { params }));
};

export const fetchAdminUsers = async () => {
  requireApiBase();
  return safeRequest(http.get("/admin/users"));
};

export const updateAdminUser = async (userId, payload) => {
  requireApiBase();
  const data = await safeRequest(http.patch(`/admin/users/${userId}`, payload));
  return data.data;
};
