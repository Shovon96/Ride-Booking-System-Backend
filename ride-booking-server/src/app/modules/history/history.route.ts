import { Router } from 'express';
import { HistoryController } from './history.controller';
import { driverFeedbackSchema, riderFeedbackSchema, updateHistorySchema } from './history.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { RiderRole } from '../rider/rider.interface';
import { validateRequest } from '../../middleware/validate.request';


const router = Router();

router.get('/', HistoryController.getAllHistories);

router.patch(
    '/rider-feedback/:historyId',
    checkAuth(RiderRole.DRIVER),
    validateRequest(riderFeedbackSchema),
    HistoryController.updateRiderFeedbackByDriver
);

router.patch(
    '/driver-feedback/:historyId',
    checkAuth(RiderRole.RIDER),
    validateRequest(driverFeedbackSchema),
    HistoryController.updateDriverFeedbackByRider
);


router.get('/:id', HistoryController.getSingleHistory);

router.patch('/:id', validateRequest(updateHistorySchema), HistoryController.updateHistory);

router.delete('/:id', checkAuth(RiderRole.ADMIN), HistoryController.deleteHistory);

export const HistoryRouter = router;