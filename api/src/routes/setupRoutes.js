import { Router } from 'express';
import {
  setupManualSparePartsController,
  setupWebInquiriesController,
  setupWebMachinesController
} from '../controllers/setupController.js';

const router = Router();

router.post('/admin/setup/web-maquinarias', setupWebMachinesController);
router.post('/admin/setup/web-consultas', setupWebInquiriesController);
router.post('/admin/setup/repuestos-manuales', setupManualSparePartsController);

export default router;
