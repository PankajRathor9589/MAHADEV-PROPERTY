import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

const http = axios.create({
  baseURL: API_BASE_URL
});

const getToken = () => localStorage.getItem("mahadev_token");

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

  return `${API_ORIGIN}${path}`;
};

const safeRequest = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const registerUser = async (payload) => safeRequest(http.post("/auth/register", payload));
export const loginUser = async (payload) => safeRequest(http.post("/auth/login", payload));
export const fetchMe = async () => {
  const data = await safeRequest(http.get("/auth/me"));
  return data.user;
};

export const fetchProperties = async (params = {}) => safeRequest(http.get("/properties", { params }));
export const fetchPropertyById = async (id) => {
  const data = await safeRequest(http.get(`/properties/${id}`));
  return data.data;
};

export const createProperty = async (payload) => {
  const data = await safeRequest(http.post("/properties", buildPropertyFormData(payload)));
  return data.data;
};

export const updateProperty = async (id, payload) => {
  const data = await safeRequest(http.put(`/properties/${id}`, buildPropertyFormData(payload)));
  return data.data;
};

export const deleteProperty = async (id) => safeRequest(http.delete(`/properties/${id}`));

export const updatePropertyApproval = async (id, approvalStatus, rejectionReason = "") => {
  const data = await safeRequest(
    http.patch(`/properties/${id}/approval`, { approvalStatus, rejectionReason })
  );
  return data.data;
};

export const updatePropertyFeatured = async (id, isFeatured, featuredDays = 30) => {
  const data = await safeRequest(
    http.patch(`/properties/${id}/featured`, { isFeatured, featuredDays })
  );
  return data.data;
};

export const submitInquiry = async (propertyId, payload) => {
  const data = await safeRequest(http.post(`/properties/${propertyId}/inquiries`, payload));
  return data.data;
};

export const submitLead = async (payload) => {
  const data = await safeRequest(http.post("/inquiries", payload));
  return data.data;
};

export const fetchInquiries = async (params = {}) => safeRequest(http.get("/inquiries", { params }));
export const updateInquiryStatus = async (id, status) => {
  const data = await safeRequest(http.patch(`/inquiries/${id}/status`, { status }));
  return data.data;
};

export const fetchAdminAnalytics = async () => safeRequest(http.get("/admin/analytics"));
export const fetchAdminProperties = async (params = {}) =>
  safeRequest(http.get("/admin/properties", { params }));
export const fetchAdminUsers = async () => safeRequest(http.get("/admin/users"));
export const updateAdminUser = async (userId, payload) => {
  const data = await safeRequest(http.patch(`/admin/users/${userId}`, payload));
  return data.data;
};
