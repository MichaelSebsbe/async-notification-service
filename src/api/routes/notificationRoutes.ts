import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const router = Router();
const controller = new NotificationController();

router.use(apiKeyMiddleware);

router.post('/broadcast', controller.broadcast);
router.post('/users', controller.sendToUsers);
router.post('/platforms', controller.sendToPlatforms);
router.post('/tokens', controller.sendToTokens);

export default router;
