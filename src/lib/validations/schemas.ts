import { z } from "zod";
import { LISTING_CATEGORIES, type ListingCategoryValue } from "@/lib/listing-categories";

const categoryValues = LISTING_CATEGORIES.map((c) => c.value) as [
  ListingCategoryValue,
  ...ListingCategoryValue[],
];

export const inquirySchema = z.object({
  /** DB tours use UUID; demo listings use string ids — both are accepted when valid. */
  tourId: z.string().trim().min(1, "Tour is required.").max(128),
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: z.string().trim().min(6, "Enter a valid phone number.").max(40),
  message: z.string().trim().max(2000).optional().default(""),
  seats_requested: z.coerce.number().int().min(1).max(500),
});

export const hutUpdateSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required.").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  profile_photo_url: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .refine((s) => !s || z.string().url().safeParse(s).success, "Enter a valid image URL."),
  hut_experience: z.string().trim().max(8000).optional().default(""),
  area_of_operation: z.string().trim().max(500).optional().default(""),
});

export const tourSaveSchema = z
  .object({
    destination: z.string().trim().min(1).max(200),
    departure_city: z.string().trim().min(1).max(120),
    departure_date: z.string().min(1),
    return_date: z.string().min(1),
    duration: z.string().trim().min(1).max(80),
    price: z.coerce.number().min(0).max(99999999),
    seats_total: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return null;
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    }, z.number().int().min(0).max(10000).nullable()),
    listing_category: z.enum(categoryValues),
    itinerary: z.string().trim().max(20000).optional().default(""),
    itinerary_pdf_path: z
      .string()
      .trim()
      .max(2000)
      .optional()
      .refine((s) => !s || z.string().url().safeParse(s).success, "Invalid PDF URL."),
    inclusions: z.string().trim().max(10000).optional().default(""),
    exclusions: z.string().trim().max(10000).optional().default(""),
    cancellation_policy: z.string().trim().max(10000).optional().default(""),
    whatsapp_contact: z.string().trim().max(30).optional().default(""),
  })
  .refine(
    (d) => {
      const dep = Date.parse(d.departure_date);
      const ret = Date.parse(d.return_date);
      return !Number.isNaN(dep) && !Number.isNaN(ret) && ret >= dep;
    },
    { message: "Return date must be on or after departure.", path: ["return_date"] },
  );

export const reviewSubmitSchema = z.object({
  tourId: z.string().trim().min(1).max(128),
  author_name: z.string().trim().min(1, "Name is required.").max(120),
  author_email: z.preprocess(
    (v) => {
      if (v == null) return undefined;
      if (typeof v !== "string") return v;
      const t = v.trim();
      return t === "" ? undefined : t;
    },
    z.string().email("Invalid email.").max(200).optional(),
  ),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional().default(""),
});
