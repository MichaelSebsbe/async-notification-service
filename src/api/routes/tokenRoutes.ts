// src/api/routes/tokenRoutes.ts
import express from 'express';
import { TokenController } from '../controllers/TokenController';

const router = express.Router();
const controller = new TokenController();

router.post('/token', controller.register);
router.delete('/token/:token', controller.removeByToken);
router.delete('/user/:userId/token', controller.removeByUser);
router.put('/token', controller.update);

export default router;