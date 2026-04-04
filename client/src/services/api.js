import axios from "axios";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "").trim();
export const API_ORIGIN = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "";
const hasApiBase = Boolean(API_BASE_URL);
const defaultApiMessage = "API is not configured for this deployment. Set VITE_API_URL to enable login, admin, and inquiry features.";

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

const parseError = (error) => {
  return error?.response?.data?.message || error.message || "Request failed";
};

const toFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (["images", "nearbyPlaces", "retainedImages"].includes(key)) {
      return;
    }

    if (value === undefined || value === null) {
      return;
    }

    formData.append(key, String(value));
  });

  formData.append("nearbyPlaces", JSON.stringify(payload.nearbyPlaces || []));

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

export const registerUser = async (payload) => {
  try {
    requireApiBase();
    const response = await http.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const loginUser = async (payload) => {
  try {
    requireApiBase();
    const response = await http.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchMe = async () => {
  try {
    requireApiBase();
    const response = await http.get("/auth/me");
    return response.data.user;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchProperties = async (params = {}) => {
  if (!hasApiBase) {
    return { data: [] };
  }

  try {
    const response = await http.get("/properties", { params });
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchPropertyById = async (id) => {
  try {
    requireApiBase();
    const response = await http.get(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const createProperty = async (payload) => {
  try {
    requireApiBase();
    const response = await http.post("/properties", toFormData(payload));
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateProperty = async (id, payload) => {
  try {
    requireApiBase();
    const response = await http.put(`/properties/${id}`, toFormData(payload));
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const deleteProperty = async (id) => {
  try {
    requireApiBase();
    await http.delete(`/properties/${id}`);
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const markPropertySold = async (id) => {
  try {
    requireApiBase();
    const response = await http.patch(`/properties/${id}/sold`);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updatePropertyApproval = async (id, status, rejectedReason = "") => {
  try {
    requireApiBase();
    const response = await http.patch(`/properties/${id}/approval`, { status, rejectedReason });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const submitInquiry = async (propertyId, payload) => {
  try {
    requireApiBase("Online inquiry submission is not configured yet. Please call or WhatsApp Sagar Infra to continue.");
    const response = await http.post(`/properties/${propertyId}/inquiries`, payload);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchSellerAnalytics = async () => {
  try {
    requireApiBase();
    const response = await http.get("/seller/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchSellerInquiries = async (params = {}) => {
  try {
    requireApiBase();
    const response = await http.get("/seller/inquiries", { params });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateSellerInquiryStatus = async (id, status) => {
  try {
    requireApiBase();
    const response = await http.patch(`/seller/inquiries/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminAnalytics = async () => {
  try {
    requireApiBase();
    const response = await http.get("/admin/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminSellers = async () => {
  try {
    requireApiBase();
    const response = await http.get("/admin/sellers");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateSellerStatus = async (sellerId, isActive) => {
  try {
    requireApiBase();
    const response = await http.patch(`/admin/sellers/${sellerId}/status`, { isActive });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminInquiries = async (params = {}) => {
  try {
    requireApiBase();
    const response = await http.get("/admin/inquiries", { params });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};
