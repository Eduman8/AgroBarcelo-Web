import { Router } from 'express';
import { setupWebMachinesController } from '../controllers/setupController.js';

const router = Router();

router.post('/admin/setup/web-maquinarias', setupWebMachinesController);

export default router;
