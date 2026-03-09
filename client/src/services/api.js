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

  return `${API_ORIGIN}${path}`;
};

export const registerUser = async (payload) => {
  try {
    const response = await http.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await http.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchMe = async () => {
  try {
    const response = await http.get("/auth/me");
    return response.data.user;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchProperties = async (params = {}) => {
  try {
    const response = await http.get("/properties", { params });
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const response = await http.get(`/properties/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const createProperty = async (payload) => {
  try {
    const response = await http.post("/properties", toFormData(payload));
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateProperty = async (id, payload) => {
  try {
    const response = await http.put(`/properties/${id}`, toFormData(payload));
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const deleteProperty = async (id) => {
  try {
    await http.delete(`/properties/${id}`);
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const markPropertySold = async (id) => {
  try {
    const response = await http.patch(`/properties/${id}/sold`);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updatePropertyApproval = async (id, status, rejectedReason = "") => {
  try {
    const response = await http.patch(`/properties/${id}/approval`, { status, rejectedReason });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const submitInquiry = async (propertyId, payload) => {
  try {
    const response = await http.post(`/properties/${propertyId}/inquiries`, payload);
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchSellerAnalytics = async () => {
  try {
    const response = await http.get("/seller/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchSellerInquiries = async (params = {}) => {
  try {
    const response = await http.get("/seller/inquiries", { params });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateSellerInquiryStatus = async (id, status) => {
  try {
    const response = await http.patch(`/seller/inquiries/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminAnalytics = async () => {
  try {
    const response = await http.get("/admin/analytics");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminSellers = async () => {
  try {
    const response = await http.get("/admin/sellers");
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const updateSellerStatus = async (sellerId, isActive) => {
  try {
    const response = await http.patch(`/admin/sellers/${sellerId}/status`, { isActive });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

export const fetchAdminInquiries = async (params = {}) => {
  try {
    const response = await http.get("/admin/inquiries", { params });
    return response.data.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};
