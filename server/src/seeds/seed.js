import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Property from '../models/Property.js';
import { properties } from './seedData.js';

dotenv.config();
await connectDB();
await Property.deleteMany();
await Property.insertMany(properties);
console.log('Seeded properties');
process.exit();
