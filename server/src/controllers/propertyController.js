import Property from '../models/Property.js';

export const getProperties = async (req, res) => {
  const { location, propertyType, minPrice, maxPrice, bhk, status } = req.query;
  const query = {};
  if (location) query.$or = [{ 'location.city': new RegExp(location, 'i') }, { 'location.area': new RegExp(location, 'i') }];
  if (propertyType) query.propertyType = propertyType;
  if (status) query.status = status;
  if (bhk) query.bedrooms = Number(bhk);
  if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
  const data = await Property.find(query).sort({ createdAt: -1 });
  res.json({ data });
};

export const getProperty = async (req, res) => {
  const data = await Property.findById(req.params.id);
  if (!data) return res.status(404).json({ message: 'Property not found' });
  data.views += 1;
  await data.save();
  res.json({ data });
};

export const createProperty = async (req, res) => res.status(201).json({ data: await Property.create(req.body) });
export const updateProperty = async (req, res) => res.json({ data: await Property.findByIdAndUpdate(req.params.id, req.body, { new: true }) });
export const deleteProperty = async (req, res) => { await Property.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); };
