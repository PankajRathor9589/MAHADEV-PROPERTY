import Lead from '../models/Lead.js';

const createLead = (type) => async (req, res) => {
  const data = await Lead.create({ ...req.body, type });
  res.status(201).json({ data });
};

export const inquiry = createLead('inquiry');
export const callback = createLead('callback');
export const siteVisit = createLead('site-visit');
export const getLeads = async (_, res) => res.json({ data: await Lead.find().sort({ createdAt: -1 }) });
