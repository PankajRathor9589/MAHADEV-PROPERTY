import api from "./client";

export const authApi = {
  signup: (payload) => api.post("/auth/signup", payload),
  login: (payload) => api.post("/auth/login", payload),
  me: () => api.get("/auth/me")
};

export const propertyApi = {
  list: (params) => api.get("/properties", { params }),
  featured: () => api.get("/properties/featured/list"),
  trending: () => api.get("/properties/trending/list"),
  locationTree: () => api.get("/properties/location-tree"),
  bySlug: (slug) => api.get(`/properties/slug/${slug}`),
  similar: (id) => api.get(`/properties/${id}/similar`),
  create: (payload) => api.post("/properties", payload),
  update: (id, payload) => api.put(`/properties/${id}`, payload),
  remove: (id) => api.delete(`/properties/${id}`)
};

export const inquiryApi = {
  create: (payload) => api.post("/inquiries", payload),
  list: () => api.get("/inquiries"),
  updateStatus: (id, status) => api.patch(`/inquiries/${id}/status`, { status })
};

export const reviewApi = {
  list: (propertyId) => api.get(`/reviews/${propertyId}`),
  submit: (propertyId, payload) => api.post(`/reviews/${propertyId}`, payload),
  helpful: (id) => api.post(`/reviews/helpful/${id}`),
  remove: (id) => api.delete(`/reviews/${id}`)
};

export const reportApi = {
  create: (propertyId, payload) => api.post(`/reports/${propertyId}`, payload),
  list: () => api.get("/reports"),
  updateStatus: (id, status) => api.patch(`/reports/${id}`, { status })
};

export const userApi = {
  collections: () => api.get("/users/collections"),
  toggleFavorite: (propertyId) => api.post(`/users/favorites/${propertyId}`),
  addRecent: (propertyId) => api.post(`/users/recent/${propertyId}`),
  toggleCompare: (propertyId) => api.post(`/users/compare/${propertyId}`)
};

export const adminApi = {
  stats: () => api.get("/admin/stats"),
  health: () => api.get("/admin/health")
};

export const alertApi = {
  create: (payload) => api.post("/alerts", payload),
  list: () => api.get("/alerts"),
  updateStatus: (id, status) => api.patch(`/alerts/${id}/status`, { status })
};

export const uploadApi = {
  images: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return api.post("/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  media: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post("/upload/media", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
