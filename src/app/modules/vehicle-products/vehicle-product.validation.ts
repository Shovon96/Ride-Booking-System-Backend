import z from "zod";
import { ProductCategory, ProductStatus } from "./vehicle-product.interface";

export const createVehicleProductZodSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters long")
    .max(200, "Title cannot exceed 200 characters")
    .trim(),

  images: z.array(z.string().url("Each image must be a valid URL"))
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),

  description: z.string()
    .min(10, "Description must be at least 10 characters long")
    .max(2000, "Description cannot exceed 2000 characters"),

  price: z.number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),

  status: z.nativeEnum(ProductStatus)
    .default(ProductStatus.IN_STOCK)
    .optional(),

  type: z.string()
    .min(2, "Type must be at least 2 characters long")
    .trim(),

  brand: z.string()
    .min(2, "Brand name must be at least 2 characters long")
    .trim(),

  sku: z.string()
    .min(3, "SKU must be at least 3 characters long")
    .trim()
    .regex(/^[A-Z0-9-]+$/, "SKU must contain only uppercase letters, numbers, and hyphens"),

  warranty: z.string()
    .min(2, "Warranty information is required"),

  category: z.nativeEnum(ProductCategory, {
    message: "Category must be either CAR or BIKE"
  }),

  specifications: z.record(z.string(), z.string())
    .refine((specs) => Object.keys(specs).length > 0, {
      message: "At least one specification is required"
    }),

  features: z.array(z.string().min(3, "Each feature must be at least 3 characters long"))
    .min(1, "At least one feature is required")
    .max(20, "Maximum 20 features allowed"),
});

export const updateVehicleProductZodSchema = createVehicleProductZodSchema.partial();
