import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();
const controller = new NotificationController();

router.post('/broadcast', controller.broadcast);
router.post('/users', controller.sendToUsers);
router.post('/platforms', controller.sendToPlatforms);
router.post('/token/:token', controller.sendToToken);

export default router;
