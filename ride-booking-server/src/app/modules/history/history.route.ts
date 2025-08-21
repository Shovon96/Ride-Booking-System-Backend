import { Router } from 'express';
import { HistoryController } from './history.controller';
import { driverFeedbackSchema, riderFeedbackSchema, updateHistorySchema } from './history.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { RiderRole } from '../rider/rider.interface';
import { validateRequest } from '../../middleware/validate.request';


const router = Router();

router.get('/', HistoryController.getAllHistories);

router.patch(
    '/rider-feedback/:rideId',
    checkAuth(RiderRole.RIDER),
    validateRequest(riderFeedbackSchema),
    HistoryController.updateRiderFeedback
);

router.patch(
    '/driver-feedback/:driverId',
    checkAuth(RiderRole.DRIVER),
    validateRequest(driverFeedbackSchema),
    HistoryController.updateDriverFeedback
);


router.get('/:id', HistoryController.getSingleHistory);

router.patch('/:id', validateRequest(updateHistorySchema), HistoryController.updateHistory);

router.delete('/:id', checkAuth(RiderRole.ADMIN), HistoryController.deleteHistory);

export const HistoryRouter = router;