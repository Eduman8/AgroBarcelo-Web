import { Router } from 'express';
import {
  getManualSparePartsDiagnosticsController,
  searchManualSparePartsController
} from '../controllers/manualSparePartsSearchController.js';

const router = Router();

router.get('/buscador-repuestos/diagnostico', getManualSparePartsDiagnosticsController);
router.get('/buscador-repuestos', searchManualSparePartsController);

export default router;
