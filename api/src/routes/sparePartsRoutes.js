import { Router } from 'express';
import {
  getSparePartByIdController,
  getSparePartsController,
  getSparePartsCountController
} from '../controllers/sparePartsController.js';

const router = Router();

router.get('/repuestos/count', getSparePartsCountController);
router.get('/repuestos', getSparePartsController);
router.get('/repuestos/:id', getSparePartByIdController);

export default router;
