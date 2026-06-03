import { Router } from 'express';
import { getSparePartsController, getSparePartsCountController } from '../controllers/sparePartsController.js';

const router = Router();

router.get('/repuestos/count', getSparePartsCountController);
router.get('/repuestos', getSparePartsController);

export default router;
