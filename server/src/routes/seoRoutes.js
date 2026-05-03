import { Router } from "express";
import { getSitemapXml } from "../controllers/seoController.js";

const router = Router();

router.get("/sitemap.xml", getSitemapXml);

export default router;
