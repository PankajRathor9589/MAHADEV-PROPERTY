import { Router } from 'express';
import { addReview, getReviews, markHelpful, reportProperty } from '../controllers/reviewController.js';

const router = Router();
router.get('/:propertyId', getReviews);
router.post('/', addReview);
router.patch('/:id/helpful', markHelpful);
router.post('/report', reportProperty);

export default router;
