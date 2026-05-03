import axios from "axios";

export const API = import.meta.env.VITE_API_URL;
export const API_BASE_URL = String(API || "").trim().replace(/\/$/, "");
export const API_ORIGIN = API_BASE_URL ? API_BASE_URL.replace(/\/api\/?$/, "") : "";

const hasApiBase = Boolean(API_BASE_URL);
const defaultApiMessage =
  "API is not configured for this deployment. Set VITE_API_URL to enable login, admin, property, and lead features.";
const wakeMessage = "Server waking up, please wait...";

const http = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 20000
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
  if (!error?.response || error?.code === "ERR_NETWORK" || [502, 503, 504].includes(error?.response?.status)) {
    return wakeMessage;
  }

  return (
    error?.response?.data?.message ||
    (Array.isArray(error?.response?.data?.details) ? error.response.data.details.join(", ") : "") ||
    error.message ||
    "Request failed"
  );
};

const safeRequest = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    throw new Error(parseError(error));
  }
};

const buildPropertyFormData = (payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (["images", "amenities", "retainedImages", "videos", "media", "videoFiles", "retainedVideos"].includes(key)) {
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

  if (Array.isArray(payload.videos)) {
    formData.append("videos", JSON.stringify(payload.videos));
  }

  if (Array.isArray(payload.retainedVideos)) {
    formData.append("retainedVideos", JSON.stringify(payload.retainedVideos));
  }

  if (Array.isArray(payload.media)) {
    formData.append("media", JSON.stringify(payload.media));
  }

  if (Array.isArray(payload.images)) {
    payload.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  return formData;
};

const applyCloudinaryTransform = (url, options = {}) => {
  if (!/res\.cloudinary\.com/i.test(url) || !url.includes("/image/upload/")) {
    return url;
  }

  const transforms = [
    "f_auto",
    "q_auto",
    options.width ? `w_${options.width}` : null,
    options.height ? `h_${options.height}` : null,
    options.crop ? `c_${options.crop}` : null
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/image/upload/", `/image/upload/${transforms}/`);
};

const applyUnsplashTransform = (url, options = {}) => {
  if (!/images\.unsplash\.com/i.test(url)) {
    return url;
  }

  try {
    const nextUrl = new URL(url);

    nextUrl.searchParams.set("auto", "format");
    nextUrl.searchParams.set("q", String(options.quality || nextUrl.searchParams.get("q") || 80));

    if (options.width) {
      nextUrl.searchParams.set("w", String(options.width));
    }

    if (options.height) {
      nextUrl.searchParams.set("h", String(options.height));
    }

    if (options.crop === "fill") {
      nextUrl.searchParams.set("fit", "crop");
    }

    return nextUrl.toString();
  } catch (error) {
    return url;
  }
};

const applyImageTransform = (url, options = {}) => applyUnsplashTransform(applyCloudinaryTransform(url, options), options);

export const resolveImageUrl = (path, options = {}) => {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return applyImageTransform(path, options);
  }

  return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
};

export const buildResponsiveImageSrcSet = (path, widths = [], options = {}) => {
  if (!path || !Array.isArray(widths) || widths.length === 0) {
    return "";
  }

  const sources = [...new Set(widths.map((value) => Number(value)).filter((value) => Number.isFinite(value) && value > 0))]
    .map((width) => {
      const url = resolveImageUrl(path, { ...options, width });
      return url ? `${url} ${width}w` : "";
    })
    .filter(Boolean);

  return sources.length > 1 ? sources.join(", ") : "";
};

export const registerUser = async (payload) => {
  requireApiBase();
  return safeRequest(http.post("/auth/register", payload));
};

export const loginUser = async (payload) => {
  requireApiBase();
  return safeRequest(http.post("/auth/login", payload));
};

export const loginAdminUser = async (payload) => {
  requireApiBase();
  return safeRequest(http.post("/auth/admin/login", payload));
};

export const fetchMe = async () => {
  requireApiBase();
  const data = await safeRequest(http.get("/auth/me"));
  return data.user;
};

export const fetchProperties = async (params = {}) => {
  if (!hasApiBase) {
    return {
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 0,
        total: 0,
        pages: 1
      }
    };
  }

  return safeRequest(http.get("/property", { params }));
};

export const fetchPropertyById = async (id) => {
  requireApiBase();
  const data = await safeRequest(http.get(`/property/${id}`));
  return data.data;
};

export const createProperty = async (payload) => {
  requireApiBase();
  const data = await safeRequest(http.post("/property", buildPropertyFormData(payload)));
  return data.data;
};

export const updateProperty = async (id, payload) => {
  requireApiBase();
  const data = await safeRequest(http.put(`/property/${id}`, buildPropertyFormData(payload)));
  return data.data;
};

export const deleteProperty = async (id) => {
  requireApiBase();
  return safeRequest(http.delete(`/property/${id}`));
};

export const updatePropertyApproval = async (id, approvalStatus, rejectionReason = "") => {
  requireApiBase();
  const data = await safeRequest(
    http.patch(`/property/${id}/approval`, {
      approvalStatus,
      rejectionReason
    })
  );
  return data.data;
};

export const updatePropertyFeatured = async (id, isFeatured, featuredDays = 30) => {
  requireApiBase();
  const data = await safeRequest(
    http.patch(`/property/${id}/featured`, {
      isFeatured,
      featuredDays
    })
  );
  return data.data;
};

export const submitLead = async (payload) => {
  requireApiBase("Online lead submission is not configured yet. Please call or WhatsApp Sagar Infra to continue.");
  const data = await safeRequest(http.post("/leads", payload));
  return data.data;
};

export const fetchInquiries = async (params = {}) => {
  requireApiBase();
  return safeRequest(http.get("/leads", { params }));
};

export const updateInquiryStatus = async (id, status) => {
  requireApiBase();
  const data = await safeRequest(http.patch(`/leads/${id}/status`, { status }));
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

export const uploadPropertyMedia = async (files = []) => {
  requireApiBase();

  if (!Array.isArray(files) || files.length === 0) {
    return [];
  }

  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const data = await safeRequest(http.post("/upload/media", formData));
  return data.items || data.data || [];
};
