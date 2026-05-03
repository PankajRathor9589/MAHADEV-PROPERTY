import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Property from "../models/Property.js";
import { legacyProperties } from "../data/legacyProperties.js";
import { ensureAdminSessionUser } from "../utils/adminSession.js";

dotenv.config();

const migrateLegacyProperties = async () => {
  try {
    await connectDB();

    const adminUser = await ensureAdminSessionUser();
    let createdCount = 0;
    let skippedCount = 0;

    for (const property of legacyProperties) {
      const existingProperty = await Property.findOne({ slug: property.slug }).select("_id");

      if (existingProperty) {
        skippedCount += 1;
        continue;
      }

      await Property.create({
        ...property,
        postedBy: adminUser._id,
        contactName: adminUser.name,
        contactEmail: adminUser.email,
        contactPhone: adminUser.phone || process.env.ADMIN_SESSION_PHONE || "7692016188"
      });

      createdCount += 1;
    }

    console.log(`Legacy property migration completed. Created: ${createdCount}, skipped: ${skippedCount}.`);
    process.exit(0);
  } catch (error) {
    console.error("Legacy property migration failed.", error);
    process.exit(1);
  }
};

migrateLegacyProperties();
