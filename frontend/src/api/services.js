import api from "./client";
import {
  clearDemoSession,
  fileToDataUrl,
  getDemoFavorites,
  getDemoInquiries,
  getDemoProperties,
  getDemoSession,
  getDemoUsers,
  saveDemoFavorites,
  saveDemoInquiries,
  saveDemoProperties,
  saveDemoSession,
  saveDemoUsers,
  seedDemoStore
} from "./demoStore";
import { DEMO_MEDIA } from "../data/demoData";

const DEFAULT_AGENT = {
  name: "Mahadev Property",
  phone: "+91 76920 16188",
  email: "hello@mahadevproperty.com",
  whatsapp: "917692016188"
};

const FORCE_DEMO = import.meta.env.VITE_USE_DEMO_DATA === "true";
const ALLOW_DEMO_FALLBACK = import.meta.env.VITE_USE_DEMO_DATA !== "false";

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));
const getPayload = (response) => response.data;
const getList = (response) => response.data?.data || response.data?.items || [];
const getItem = (response) => response.data?.data || response.data?.item || null;
const getPagination = (response) => response.data?.pagination || response.data?.meta || null;

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.response = { status, data: { message } };
  return error;
};

const publicUser = (user) => {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return {
    ...safeUser,
    id: safeUser.id || safeUser._id
  };
};

const normalizeImage = (entry) => {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return { url: entry, filename: entry.split("/").pop() || "image" };
  }

  return {
    url: entry.url || entry.secureUrl || entry.path || "",
    filename: entry.filename || entry.publicId || entry.url?.split("/").pop() || "image"
  };
};

const deriveAmenities = (property) => {
  const amenities = [];

  if ((property.bedrooms ?? property.features?.bedrooms ?? 0) >= 2) amenities.push("Family layout");
  if ((property.bathrooms ?? property.features?.bathrooms ?? 0) >= 2) amenities.push("Multiple bathrooms");
  if ((property.area ?? property.areaSqFt ?? property.areaValue ?? 0) > 1200) amenities.push("Spacious floor plan");
  if (property.features?.parking) amenities.push("Parking");
  if (property.features?.waterSupply) amenities.push("Water connection");
  if (property.features?.electricity) amenities.push("Electricity");
  if (property.features?.roadAccess) amenities.push("Road access");

  return amenities;
};

const normalizeAgent = (raw) => {
  if (!raw) {
    return DEFAULT_AGENT;
  }

  if (raw.dealer) {
    return normalizeAgent(raw.dealer);
  }

  const phone = raw.phone || raw.whatsapp || DEFAULT_AGENT.phone;
  const digits = String(phone || "")
    .replace(/[^\d]/g, "")
    .replace(/^0+/, "");

  return {
    id: raw.id || raw._id || null,
    name: raw.name || DEFAULT_AGENT.name,
    phone: raw.phone || DEFAULT_AGENT.phone,
    email: raw.email || DEFAULT_AGENT.email,
    agencyName: raw.agencyName || raw.company || "Mahadev Property",
    whatsapp: raw.whatsapp || digits || DEFAULT_AGENT.whatsapp
  };
};

export const normalizeProperty = (raw) => {
  const images = Array.isArray(raw.images) ? raw.images.map(normalizeImage).filter(Boolean) : [];
  const locationObject = typeof raw.location === "object" ? raw.location : null;
  const addressObject = raw.address || {};
  const locationText = typeof raw.location === "string"
    ? raw.location
    : [
        addressObject.line1,
        locationObject?.address,
        addressObject.line2,
        locationObject?.locality,
        locationObject?.tehsil,
        locationObject?.district
      ]
        .filter(Boolean)
        .join(", ");

  const city = raw.city || addressObject.city || locationObject?.city || locationObject?.district || "City Center";
  const amenities = Array.isArray(raw.amenities) && raw.amenities.length > 0
    ? raw.amenities
    : Array.isArray(raw.highlights) && raw.highlights.length > 0
      ? raw.highlights
      : deriveAmenities(raw);

  return {
    id: raw.id || raw._id,
    title: raw.title || "Untitled Property",
    description: raw.description || "No description added yet.",
    propertyType: raw.propertyType || (Number(raw.bedrooms ?? raw.features?.bedrooms ?? 0) > 0 ? "Apartment" : "Plot"),
    price: Number(raw.price || 0),
    location: locationText || city,
    city,
    bedrooms: Number(raw.bedrooms ?? raw.features?.bedrooms ?? 0),
    bathrooms: Number(raw.bathrooms ?? raw.features?.bathrooms ?? 0),
    area: Number(raw.area ?? raw.areaSqFt ?? raw.areaValue ?? 0),
    images: images.length > 0 ? images : [{ url: DEMO_MEDIA.propertyImages[0], filename: "placeholder.jpg" }],
    amenities,
    status: raw.status || raw.listingStatus || "approved",
    rejectedReason: raw.rejectedReason || "",
    views: Number(raw.views || 0),
    createdAt: raw.createdAt,
    agent: normalizeAgent(raw.agent || raw.seller || raw.dealer),
    mapQuery: [locationText, city].filter(Boolean).join(", "),
    raw
  };
};

const normalizeInquiry = (raw) => ({
  id: raw.id || raw._id,
  status: raw.status || "new",
  message: raw.message || "",
  phone: raw.phone || raw.buyerPhone || "",
  email: raw.email || raw.buyerEmail || "",
  name: raw.name || raw.buyerName || "Buyer",
  property: raw.property ? normalizeProperty(raw.property) : null,
  buyer: raw.buyer || null,
  agent: normalizeAgent(raw.agent || raw.seller),
  createdAt: raw.createdAt
});

const parseJson = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getCurrentDemoUser = () => {
  seedDemoStore();

  const session = getDemoSession();
  if (!session?.userId) {
    return null;
  }

  const user = getDemoUsers().find((entry) => (entry.id || entry._id) === session.userId);
  return publicUser(user);
};

const requireDemoUser = (roles = []) => {
  const user = getCurrentDemoUser();

  if (!user) {
    throw createHttpError(401, "Please login to continue.");
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    throw createHttpError(403, "You do not have permission for this action.");
  }

  return user;
};

const paginate = (items, page = 1, limit = 9) => {
  const currentPage = Number(page || 1);
  const pageSize = Number(limit || 9);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(currentPage, 1), pages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    pagination: {
      page: safePage,
      pages,
      total,
      limit: pageSize
    }
  };
};

const applyPropertyFilters = (properties, params = {}, options = {}) => {
  const { includeAllStatuses = false } = options;
  const search = String(params.search || "").trim().toLowerCase();
  const city = String(params.city || "").toLowerCase();
  const propertyType = String(params.propertyType || "").toLowerCase();
  const status = String(params.status || "").toLowerCase();
  const minPrice = Number(params.minPrice || 0);
  const maxPrice = Number(params.maxPrice || 0);
  const bedrooms = Number(params.bedrooms || 0);

  let filtered = [...properties];

  if (!includeAllStatuses) {
    filtered = filtered.filter((property) => property.status === "approved");
  }

  if (status) {
    filtered = filtered.filter((property) => property.status.toLowerCase() === status);
  }

  if (city) {
    filtered = filtered.filter((property) => property.city.toLowerCase() === city);
  }

  if (propertyType) {
    filtered = filtered.filter((property) => property.propertyType.toLowerCase() === propertyType);
  }

  if (minPrice) {
    filtered = filtered.filter((property) => Number(property.price) >= minPrice);
  }

  if (maxPrice) {
    filtered = filtered.filter((property) => Number(property.price) <= maxPrice);
  }

  if (bedrooms) {
    filtered = filtered.filter((property) => Number(property.bedrooms) >= bedrooms);
  }

  if (search) {
    filtered = filtered.filter((property) =>
      [property.title, property.location, property.city, property.description, property.propertyType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }

  filtered.sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
  return filtered;
};

const getPropertyById = (id) => {
  const property = getDemoProperties().find((entry) => (entry.id || entry._id) === id);
  return property ? normalizeProperty(property) : null;
};

const mapDemoInquiries = () => {
  const properties = getDemoProperties();

  return getDemoInquiries().map((inquiry) => {
    const property = properties.find((entry) => (entry.id || entry._id) === inquiry.propertyId);
    return normalizeInquiry({
      ...inquiry,
      property,
      agent: property?.agent
    });
  });
};

const buildAgentAnalytics = (userId) => {
  const properties = getDemoProperties().filter((property) => property.agent?.id === userId || property.agent?._id === userId);
  const inquiries = mapDemoInquiries().filter((inquiry) => inquiry.property?.agent?.id === userId);

  return {
    totalProperties: properties.length,
    approvedProperties: properties.filter((property) => property.status === "approved").length,
    pendingProperties: properties.filter((property) => property.status === "pending").length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter((inquiry) => inquiry.status === "new").length
  };
};

const buildAdminAnalytics = () => {
  const users = getDemoUsers();
  const properties = getDemoProperties();
  const inquiries = getDemoInquiries();

  return {
    totals: {
      totalUsers: users.length,
      totalAgents: users.filter((user) => user.role === "agent").length,
      totalProperties: properties.length,
      pendingProperties: properties.filter((property) => property.status === "pending").length,
      approvedProperties: properties.filter((property) => property.status === "approved").length,
      totalInquiries: inquiries.length
    }
  };
};

const parsePayloadImages = async (files) => {
  if (!files.length) {
    return [];
  }

  const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
  return dataUrls.map((url, index) => ({
    url,
    filename: `${Date.now()}-${index}-upload.jpg`
  }));
};

const parsePropertyInput = async (payload, existingProperty = {}) => {
  if (!(payload instanceof FormData)) {
    return {
      ...existingProperty,
      ...payload
    };
  }

  const retainedImages = parseJson(payload.get("retainedImages"), existingProperty.images || []);
  const uploadedImages = await parsePayloadImages(payload.getAll("images").filter(Boolean));
  const amenities = parseJson(payload.get("amenities"), []).filter(Boolean);
  const images = [...retainedImages, ...uploadedImages];

  return {
    ...existingProperty,
    title: payload.get("title") || existingProperty.title || "Untitled Property",
    propertyType: payload.get("propertyType") || existingProperty.propertyType || "Apartment",
    price: Number(payload.get("price") || existingProperty.price || 0),
    location: payload.get("location") || existingProperty.location || "",
    city: payload.get("city") || existingProperty.city || "",
    bedrooms: Number(payload.get("bedrooms") || existingProperty.bedrooms || 0),
    bathrooms: Number(payload.get("bathrooms") || existingProperty.bathrooms || 0),
    area: Number(payload.get("area") || existingProperty.area || 0),
    description: payload.get("description") || existingProperty.description || "",
    amenities,
    images: images.length > 0 ? images : existingProperty.images || [{ url: DEMO_MEDIA.propertyImages[0], filename: "fallback.jpg" }]
  };
};

const withApiFallback = async (request, fallback, options = {}) => {
  const { fallbackOnEmpty = false, isEmpty } = options;

  if (FORCE_DEMO) {
    return fallback();
  }

  try {
    const result = await request();

    if (fallbackOnEmpty) {
      const empty = typeof isEmpty === "function" ? isEmpty(result) : !result;
      if (empty && ALLOW_DEMO_FALLBACK) {
        return fallback();
      }
    }

    return result;
  } catch (error) {
    if (!ALLOW_DEMO_FALLBACK) {
      throw error;
    }

    return fallback(error);
  }
};

export const authApi = {
  register: async (payload) =>
    withApiFallback(
      async () => getPayload(await api.post("/auth/register", payload)),
      async () => {
        await delay();
        const requestedRole = String(payload.role || "buyer").toLowerCase();

        if (requestedRole === "admin") {
          throw createHttpError(403, "Admin accounts cannot be created here. Use the secure admin access page instead.");
        }

        const users = getDemoUsers();

        if (users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
          throw createHttpError(409, "An account with this email already exists.");
        }

        const createdUser = {
          id: `demo-user-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: requestedRole === "agent" ? "agent" : "buyer",
          password: payload.password,
          isActive: true,
          agencyName: requestedRole === "agent" ? `${payload.name.split(" ")[0] || "Prime"} Realty` : ""
        };

        users.push(createdUser);
        saveDemoUsers(users);

        const token = `demo-token-${createdUser.id}`;
        saveDemoSession({ token, userId: createdUser.id });

        return { token, user: publicUser(createdUser) };
      }
    ),
  login: async (payload) =>
    withApiFallback(
      async () => getPayload(await api.post("/auth/login", payload)),
      async () => {
        await delay();
        const user = getDemoUsers().find((entry) => entry.email.toLowerCase() === String(payload.email || "").toLowerCase());

        if (!user || user.password !== payload.password) {
          throw createHttpError(401, "Invalid email or password. Try one of the demo accounts.");
        }

        if (user.isActive === false) {
          throw createHttpError(403, "This account is inactive.");
        }

        if (user.role === "admin") {
          throw createHttpError(403, "Admin access requires the secure admin key login.");
        }

        const token = `demo-token-${user.id}`;
        saveDemoSession({ token, userId: user.id });
        return { token, user: publicUser(user) };
      }
    ),
  loginAdmin: async (adminKey) => getPayload(await api.post("/auth/admin/login", { adminKey })),
  me: async () =>
    withApiFallback(
      async () => getPayload(await api.get("/auth/me")),
      async () => {
        await delay(120);
        const user = getCurrentDemoUser();

        if (!user) {
          clearDemoSession();
          throw createHttpError(401, "Your session has expired.");
        }

        if (user.role === "admin") {
          clearDemoSession();
          throw createHttpError(403, "Admin access requires the secure admin key login.");
        }

        return { user };
      }
    )
};

export const propertyApi = {
  list: async (params = {}) =>
    withApiFallback(
      async () => {
        const response = await api.get("/properties", { params });
        const items = getList(response).map(normalizeProperty);
        return {
          items,
          pagination: getPagination(response)
        };
      },
      async () => {
        await delay();
        const filtered = applyPropertyFilters(getDemoProperties().map(normalizeProperty), params);
        return paginate(filtered, params.page, params.limit || 9);
      },
      {
        fallbackOnEmpty: true,
        isEmpty: (result) => !result?.items?.length
      }
    ),
  byId: async (id) =>
    withApiFallback(
      async () => normalizeProperty(getItem(await api.get(`/properties/${id}`))),
      async () => {
        await delay();
        const property = getPropertyById(id);
        if (!property) {
          throw createHttpError(404, "Property not found.");
        }
        return property;
      }
    ),
  create: async (payload) =>
    withApiFallback(
      async () => normalizeProperty(getItem(await api.post("/properties", payload))),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        const properties = getDemoProperties();
        const property = await parsePropertyInput(payload);
        const created = {
          ...property,
          id: `demo-prop-${Date.now()}`,
          agent: user,
          status: user.role === "admin" ? "approved" : "pending",
          views: 0,
          createdAt: new Date().toISOString()
        };

        saveDemoProperties([created, ...properties]);
        return normalizeProperty(created);
      }
    ),
  update: async (id, payload) =>
    withApiFallback(
      async () => normalizeProperty(getItem(await api.put(`/properties/${id}`, payload))),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        const properties = getDemoProperties();
        const index = properties.findIndex((entry) => (entry.id || entry._id) === id);

        if (index === -1) {
          throw createHttpError(404, "Property not found.");
        }

        const existing = properties[index];
        if (user.role !== "admin" && existing.agent?.id !== user.id) {
          throw createHttpError(403, "You can only edit your own listings.");
        }

        const nextPayload = await parsePropertyInput(payload, existing);
        const updated = {
          ...existing,
          ...nextPayload,
          agent: existing.agent || user,
          status: user.role === "admin" ? existing.status : "pending"
        };

        properties[index] = updated;
        saveDemoProperties(properties);
        return normalizeProperty(updated);
      }
    ),
  remove: async (id) =>
    withApiFallback(
      async () => getPayload(await api.delete(`/properties/${id}`)),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        const properties = getDemoProperties();
        const property = properties.find((entry) => (entry.id || entry._id) === id);

        if (!property) {
          throw createHttpError(404, "Property not found.");
        }

        if (user.role !== "admin" && property.agent?.id !== user.id) {
          throw createHttpError(403, "You can only delete your own listings.");
        }

        saveDemoProperties(properties.filter((entry) => (entry.id || entry._id) !== id));

        const inquiries = getDemoInquiries().filter((inquiry) => inquiry.propertyId !== id);
        saveDemoInquiries(inquiries);

        const favorites = getDemoFavorites();
        Object.keys(favorites).forEach((userId) => {
          favorites[userId] = favorites[userId].filter((propertyId) => propertyId !== id);
        });
        saveDemoFavorites(favorites);

        return { success: true };
      }
    ),
  inquire: async (id, payload) =>
    withApiFallback(
      async () => normalizeInquiry(getItem(await api.post(`/properties/${id}/inquiries`, payload))),
      async () => {
        await delay();
        const property = getPropertyById(id);
        if (!property) {
          throw createHttpError(404, "Property not found.");
        }

        const currentUser = getCurrentDemoUser();
        const inquiries = getDemoInquiries();
        const created = {
          id: `demo-inquiry-${Date.now()}`,
          propertyId: id,
          buyerId: currentUser?.id || null,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          message: payload.message,
          status: "new",
          createdAt: new Date().toISOString()
        };

        saveDemoInquiries([created, ...inquiries]);
        return normalizeInquiry({ ...created, property, agent: property.agent, buyer: currentUser });
      }
    )
};

export const favoriteApi = {
  list: async () =>
    withApiFallback(
      async () => getList(await api.get("/favorites")).map(normalizeProperty),
      async () => {
        await delay();
        const user = requireDemoUser();
        const favorites = getDemoFavorites()[user.id] || [];
        return favorites.map(getPropertyById).filter(Boolean);
      }
    ),
  add: async (propertyId) =>
    withApiFallback(
      async () => getList(await api.post(`/favorites/${propertyId}`)).map(normalizeProperty),
      async () => {
        await delay();
        const user = requireDemoUser();
        const favorites = getDemoFavorites();
        const property = getPropertyById(propertyId);

        if (!property) {
          throw createHttpError(404, "Property not found.");
        }

        const current = new Set(favorites[user.id] || []);
        current.add(propertyId);
        favorites[user.id] = Array.from(current);
        saveDemoFavorites(favorites);

        return favorites[user.id].map(getPropertyById).filter(Boolean);
      }
    ),
  remove: async (propertyId) =>
    withApiFallback(
      async () => getList(await api.delete(`/favorites/${propertyId}`)).map(normalizeProperty),
      async () => {
        await delay();
        const user = requireDemoUser();
        const favorites = getDemoFavorites();
        favorites[user.id] = (favorites[user.id] || []).filter((entry) => entry !== propertyId);
        saveDemoFavorites(favorites);
        return favorites[user.id].map(getPropertyById).filter(Boolean);
      }
    )
};

export const inquiryApi = {
  list: async () =>
    withApiFallback(
      async () => getList(await api.get("/inquiries")).map(normalizeInquiry),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        const inquiries = mapDemoInquiries();

        if (user.role === "admin") {
          return inquiries;
        }

        return inquiries.filter((inquiry) => inquiry.property?.agent?.id === user.id);
      }
    ),
  updateStatus: async (id, status) =>
    withApiFallback(
      async () => normalizeInquiry(getItem(await api.patch(`/inquiries/${id}/status`, { status }))),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        const inquiries = getDemoInquiries();
        const index = inquiries.findIndex((entry) => (entry.id || entry._id) === id);

        if (index === -1) {
          throw createHttpError(404, "Inquiry not found.");
        }

        const property = getPropertyById(inquiries[index].propertyId);
        if (user.role !== "admin" && property?.agent?.id !== user.id) {
          throw createHttpError(403, "You can only update inquiries for your own listings.");
        }

        inquiries[index] = { ...inquiries[index], status };
        saveDemoInquiries(inquiries);
        return normalizeInquiry({ ...inquiries[index], property, agent: property?.agent });
      }
    )
};

export const agentApi = {
  analytics: async () =>
    withApiFallback(
      async () => getPayload(await api.get("/agent/analytics")),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        return { data: buildAgentAnalytics(user.id) };
      }
    ),
  properties: async () =>
    withApiFallback(
      async () => getList(await api.get("/agent/properties")).map(normalizeProperty),
      async () => {
        await delay();
        const user = requireDemoUser(["agent", "admin"]);
        return getDemoProperties()
          .filter((property) => property.agent?.id === user.id || user.role === "admin")
          .map(normalizeProperty)
          .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
      }
    )
};

export const adminApi = {
  analytics: async () =>
    withApiFallback(
      async () => getPayload(await api.get("/admin/analytics")),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        return { data: buildAdminAnalytics() };
      }
    ),
  agents: async () =>
    withApiFallback(
      async () => getList(await api.get("/admin/agents")),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        return getDemoUsers().filter((user) => user.role !== "admin").map(publicUser);
      }
    ),
  users: async () =>
    withApiFallback(
      async () => getList(await api.get("/admin/users")),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        return getDemoUsers().map(publicUser);
      }
    ),
  updateAgentStatus: async (id, isActive) =>
    withApiFallback(
      async () => getItem(await api.patch(`/admin/agents/${id}/status`, { isActive })),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        const users = getDemoUsers();
        const index = users.findIndex((entry) => (entry.id || entry._id) === id);

        if (index === -1) {
          throw createHttpError(404, "User not found.");
        }

        users[index] = { ...users[index], isActive };
        saveDemoUsers(users);
        return publicUser(users[index]);
      }
    ),
  moderationQueue: async (status) =>
    withApiFallback(
      async () => getList(await api.get("/admin/properties", { params: status ? { status } : {} })).map(normalizeProperty),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        const queue = applyPropertyFilters(getDemoProperties().map(normalizeProperty), { status }, { includeAllStatuses: true });
        return status ? queue : [...queue].sort((left, right) => {
          const priority = { pending: 0, rejected: 1, approved: 2 };
          return (priority[left.status] ?? 3) - (priority[right.status] ?? 3);
        });
      }
    ),
  moderateProperty: async (id, payload) =>
    withApiFallback(
      async () => normalizeProperty(getItem(await api.patch(`/admin/properties/${id}/moderate`, payload))),
      async () => {
        await delay();
        requireDemoUser(["admin"]);
        const properties = getDemoProperties();
        const index = properties.findIndex((entry) => (entry.id || entry._id) === id);

        if (index === -1) {
          throw createHttpError(404, "Property not found.");
        }

        properties[index] = {
          ...properties[index],
          status: payload.status,
          rejectedReason: payload.rejectedReason || ""
        };

        saveDemoProperties(properties);
        return normalizeProperty(properties[index]);
      }
    )
};
