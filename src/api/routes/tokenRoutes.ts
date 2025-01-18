// src/api/routes/tokenRoutes.ts
import express from 'express';
import { TokenController } from '../controllers/TokenController';
import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const router = express.Router();
const controller = new TokenController();

router.use(apiKeyMiddleware);

router.post('/token', controller.register);
router.delete('/token/:token', controller.removeByToken);
router.delete('/user/:userId/token', controller.removeByUser);
router.delete('/session/:sessionId', controller.removeBySession);
router.put('/token', controller.update);

export default router;