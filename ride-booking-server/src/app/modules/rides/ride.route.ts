import { Router } from 'express';
import { createRideSchema } from './ride.validation';
import { RideController } from './ride.controller';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validate.request';
import { RiderRole } from '../rider/rider.interface';

const router = Router();

router.post(
    '/request',
    checkAuth(RiderRole.RIDER, RiderRole.ADMIN),
    validateRequest(createRideSchema),
    RideController.createRide
);

export const RideRouter = router