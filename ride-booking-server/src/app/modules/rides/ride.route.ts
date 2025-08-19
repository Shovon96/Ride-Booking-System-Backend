import { Router } from 'express';
import { createRideSchema } from './ride.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validate.request';
import { RiderRole } from '../rider/rider.interface';
import { RideController } from './ride.controller';

const router = Router();

router.post(
    '/request',
    checkAuth(RiderRole.RIDER, RiderRole.ADMIN),
    validateRequest(createRideSchema),
    RideController.createRide
);

router.get('/', checkAuth(RiderRole.RIDER, RiderRole.ADMIN), RideController.getAllRides);


export const RideRouter = router