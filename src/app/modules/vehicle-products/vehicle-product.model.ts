import { model, Schema } from "mongoose";
import { IVehicleProduct, ProductCategory, ProductStatus } from "./vehicle-product.interface";

const vehicleProductSchema = new Schema<IVehicleProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [200, "Title cannot exceed 200 characters"]
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: "Product must have at least one image"
      }
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [10, "Description must be at least 10 characters long"]
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"]
    },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.IN_STOCK
    },
    type: {
      type: String,
      required: [true, "Product type is required"],
      trim: true
    },
    brand: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true
    },
    warranty: {
      type: String,
      required: [true, "Warranty information is required"]
    },
    category: {
      type: String,
      enum: Object.values(ProductCategory),
      required: [true, "Product category is required"]
    },
    specifications: {
      type: Schema.Types.Mixed,
      required: [true, "Product specifications are required"]
    },
    features: {
      type: [String],
      required: [true, "Product features are required"],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0;
        },
        message: "Product must have at least one feature"
      }
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index for search optimization
vehicleProductSchema.index({ title: 'text', description: 'text', brand: 'text', features: 'text' });
vehicleProductSchema.index({ category: 1, status: 1 });
vehicleProductSchema.index({ price: 1 });
vehicleProductSchema.index({ sku: 1 });

export const VehicleProduct = model<IVehicleProduct>("VehicleProduct", vehicleProductSchema);
