import { Router } from 'express';
import { callback, getLeads, inquiry, siteVisit } from '../controllers/leadController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.post('/inquiry', inquiry);
router.post('/callback', callback);
router.post('/site-visit', siteVisit);
router.get('/', protect, adminOnly, getLeads);

export default router;
