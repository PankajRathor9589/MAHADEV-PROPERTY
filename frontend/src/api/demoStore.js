import { DEMO_FAVORITES, DEMO_INQUIRIES, DEMO_PROPERTIES, DEMO_USERS } from "../data/demoData";

const STORAGE_KEYS = {
  users: "mp_demo_users",
  properties: "mp_demo_properties",
  inquiries: "mp_demo_inquiries",
  favorites: "mp_demo_favorites",
  session: "mp_demo_session"
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const hasWindow = () => typeof window !== "undefined";

const readJson = (key, fallback) => {
  if (!hasWindow()) {
    return clone(fallback);
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : clone(fallback);
  } catch {
    return clone(fallback);
  }
};

const writeJson = (key, value) => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const seedDemoStore = () => {
  if (!hasWindow()) {
    return;
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.users)) {
    writeJson(STORAGE_KEYS.users, DEMO_USERS);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.properties)) {
    writeJson(STORAGE_KEYS.properties, DEMO_PROPERTIES);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.inquiries)) {
    writeJson(STORAGE_KEYS.inquiries, DEMO_INQUIRIES);
  }

  if (!window.localStorage.getItem(STORAGE_KEYS.favorites)) {
    writeJson(STORAGE_KEYS.favorites, DEMO_FAVORITES);
  }
};

export const getDemoUsers = () => {
  seedDemoStore();
  return readJson(STORAGE_KEYS.users, DEMO_USERS);
};

export const saveDemoUsers = (users) => {
  writeJson(STORAGE_KEYS.users, users);
};

export const getDemoProperties = () => {
  seedDemoStore();
  return readJson(STORAGE_KEYS.properties, DEMO_PROPERTIES);
};

export const saveDemoProperties = (properties) => {
  writeJson(STORAGE_KEYS.properties, properties);
};

export const getDemoInquiries = () => {
  seedDemoStore();
  return readJson(STORAGE_KEYS.inquiries, DEMO_INQUIRIES);
};

export const saveDemoInquiries = (inquiries) => {
  writeJson(STORAGE_KEYS.inquiries, inquiries);
};

export const getDemoFavorites = () => {
  seedDemoStore();
  return readJson(STORAGE_KEYS.favorites, DEMO_FAVORITES);
};

export const saveDemoFavorites = (favorites) => {
  writeJson(STORAGE_KEYS.favorites, favorites);
};

export const getDemoSession = () => readJson(STORAGE_KEYS.session, null);

export const saveDemoSession = (session) => {
  writeJson(STORAGE_KEYS.session, session);
};

export const clearDemoSession = () => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.session);
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
