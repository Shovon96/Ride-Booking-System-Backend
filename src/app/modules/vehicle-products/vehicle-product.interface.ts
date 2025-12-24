export enum ProductStatus {
  IN_STOCK = "In Stock",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock"
}

export enum ProductCategory {
  CAR = "CAR",
  BIKE = "BIKE"
}

export interface ISpecifications {
  [key: string]: string;
}

export interface IVehicleProduct {
  title: string;
  images: string[];
  description: string;
  price: number;
  status: ProductStatus;
  type: string;
  brand: string;
  sku: string;
  warranty: string;
  category: ProductCategory;
  specifications: ISpecifications;
  features: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
