import { Router } from 'express';
import { getSparePartsController } from '../controllers/sparePartsController.js';

const router = Router();

router.get('/repuestos', getSparePartsController);

export default router;
