import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth.middleware";
import { validateRequest } from "../../middlewares/validateReq.middleware";
import { UserRole } from "../user/user.interface";
import {
  createVehicleProduct,
  deleteVehicleProduct,
  getAllVehicleProducts,
  getVehicleProductById,
  updateVehicleProduct
} from "./vehicle-product.controller";
import {
  createVehicleProductZodSchema,
  updateVehicleProductZodSchema
} from "./vehicle-product.validation";

const router = Router();

// Public routes
router.get("/", getAllVehicleProducts);
router.get("/:id", getVehicleProductById);

// Protected routes (Admin only)
router.post(
  "/create",
  // checkAuth(UserRole.ADMIN),
  validateRequest(createVehicleProductZodSchema),
  createVehicleProduct
);

router.patch(
  "/update/:id",
  checkAuth(UserRole.ADMIN),
  validateRequest(updateVehicleProductZodSchema),
  updateVehicleProduct
);

router.delete(
  "/delete/:id",
  checkAuth(UserRole.ADMIN),
  deleteVehicleProduct
);

export const vehicleProductRoute = router;
