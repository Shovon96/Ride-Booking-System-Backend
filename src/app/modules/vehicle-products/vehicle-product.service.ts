import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { IVehicleProduct } from './vehicle-product.interface';
import { VehicleProduct } from "./vehicle-product.model";

interface QueryParams {
  search?: string;
  status?: string;
  category?: string;
  brand?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  page?: string;
  limit?: string;
}

export const createVehicleProductService = async (payload: IVehicleProduct) => {
  // Check if SKU already exists
  const existingProduct = await VehicleProduct.findOne({ sku: payload.sku });
  if (existingProduct) {
    throw new AppError(httpStatus.CONFLICT, "Product with this SKU already exists");
  }

  const product = await VehicleProduct.create(payload);
  return product;
};

export const getAllVehicleProductsService = async (queryParams: QueryParams) => {
  const {
    search,
    status,
    category,
    brand,
    type,
    minPrice,
    maxPrice,
    sortBy = '-createdAt',
    page = '1',
    limit = '12'
  } = queryParams;

  // Build query object
  const query: any = {};

  // Search functionality (title, description, brand, features)
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { features: { $regex: search, $options: 'i' } }
    ];
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by category
  if (category) {
    query.category = category.toUpperCase();
  }

  // Filter by brand
  if (brand) {
    query.brand = { $regex: brand, $options: 'i' };
  }

  // Filter by type
  if (type) {
    query.type = { $regex: type, $options: 'i' };
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  // Pagination
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Sort options
  let sortOptions: any = {};
  if (sortBy) {
    const sortFields = sortBy.split(',');
    sortFields.forEach(field => {
      if (field.startsWith('-')) {
        sortOptions[field.substring(1)] = -1;
      } else {
        sortOptions[field] = 1;
      }
    });
  }

  // Execute query
  const products = await VehicleProduct.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNumber)
    .lean();

  // Get total count for pagination
  const total = await VehicleProduct.countDocuments(query);

  return {
    products,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber)
    }
  };
};

export const getVehicleProductByIdService = async (productId: string) => {
  const product = await VehicleProduct.findById(productId).lean();

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

export const updateVehicleProductService = async (
  productId: string,
  payload: Partial<IVehicleProduct>
) => {
  // Check if product exists
  const existingProduct = await VehicleProduct.findById(productId);
  if (!existingProduct) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // If SKU is being updated, check for duplicates
  if (payload.sku && payload.sku !== existingProduct.sku) {
    const duplicateSKU = await VehicleProduct.findOne({ sku: payload.sku });
    if (duplicateSKU) {
      throw new AppError(httpStatus.CONFLICT, "Product with this SKU already exists");
    }
  }

  const updatedProduct = await VehicleProduct.findByIdAndUpdate(
    productId,
    { $set: payload },
    { new: true, runValidators: true }
  ).lean();

  return updatedProduct;
};

export const deleteVehicleProductService = async (productId: string) => {
  const product = await VehicleProduct.findById(productId);
  
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  await VehicleProduct.findByIdAndDelete(productId);
  
  return { message: "Product deleted successfully" };
};
