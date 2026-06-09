import { Router } from 'express';
import { searchManualSparePartsController } from '../controllers/manualSparePartsSearchController.js';

const router = Router();

router.get('/buscador-repuestos', searchManualSparePartsController);

export default router;
