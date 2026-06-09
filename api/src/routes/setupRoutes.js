import { Router } from 'express';
import { setupManualSparePartsController, setupWebMachinesController } from '../controllers/setupController.js';

const router = Router();

router.post('/admin/setup/web-maquinarias', setupWebMachinesController);
router.post('/admin/setup/repuestos-manuales', setupManualSparePartsController);

export default router;
