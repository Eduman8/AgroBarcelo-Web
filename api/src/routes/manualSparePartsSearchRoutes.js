import { Router } from 'express';
import {
  getManualSparePartsDiagnosticsController,
  searchManualSparePartsController,
  searchVisualSparePartsController
} from '../controllers/manualSparePartsSearchController.js';

const router = Router();

router.get('/buscador-repuestos/diagnostico', getManualSparePartsDiagnosticsController);
router.get('/buscador-visual-repuestos', searchVisualSparePartsController);
router.get('/buscador-repuestos', searchManualSparePartsController);

export default router;
