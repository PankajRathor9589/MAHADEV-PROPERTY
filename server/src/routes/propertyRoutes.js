import { Router } from 'express';
import { createProperty, deleteProperty, getProperties, getProperty, updateProperty } from '../controllers/propertyController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getProperties);
router.get('/:id', getProperty);
router.post('/', protect, adminOnly, createProperty);
router.patch('/:id', protect, adminOnly, updateProperty);
router.delete('/:id', protect, adminOnly, deleteProperty);

export default router;
