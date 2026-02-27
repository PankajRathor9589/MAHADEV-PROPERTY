import { Alert } from "../models/Alert.js";

export const createAlert = async (req, res) => {
  const alert = await Alert.create(req.body);
  return res.status(201).json({ item: alert });
};

export const listAlerts = async (req, res) => {
  const items = await Alert.find().sort({ createdAt: -1 });
  return res.json({ items });
};

export const updateAlertStatus = async (req, res) => {
  const alert = await Alert.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!alert) return res.status(404).json({ message: "Alert not found" });
  return res.json({ item: alert });
};
