import { Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { asyncHandler, responseFunction } from "../../utils/controller.util";
import {
  createVehicleProductService,
  deleteVehicleProductService,
  getAllVehicleProductsService,
  getVehicleProductByIdService,
  updateVehicleProductService
} from "./vehicle-product.service";

export const createVehicleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const product = await createVehicleProductService(req.body);

    responseFunction(res, {
      message: "Vehicle product created successfully",
      statusCode: httpStatus.CREATED,
      data: product,
    });
  }
);

export const getAllVehicleProducts = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const result = await getAllVehicleProductsService(req.query);

    responseFunction(res, {
      message: "Vehicle products retrieved successfully",
      statusCode: httpStatus.OK,
      data: result.products,
      meta: result.pagination
    });
  }
);

export const getVehicleProductById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const product = await getVehicleProductByIdService(id);

    responseFunction(res, {
      message: "Vehicle product retrieved successfully",
      statusCode: httpStatus.OK,
      data: product,
    });
  }
);

export const updateVehicleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const product = await updateVehicleProductService(id, req.body);

    responseFunction(res, {
      message: "Vehicle product updated successfully",
      statusCode: httpStatus.OK,
      data: product,
    });
  }
);

export const deleteVehicleProduct = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await deleteVehicleProductService(id);

    responseFunction(res, {
      message: result.message,
      statusCode: httpStatus.OK,
      data: null,
    });
  }
);
