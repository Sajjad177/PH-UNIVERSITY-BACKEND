import { Router } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middleware/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';

const router = Router();

router.get('/:id', AdminController.getSingleAdmin);
router.get('/', AdminController.getAllAdmin);

router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  AdminController.updateAdmin,
);
router.delete('/:id', AdminController.deleteAdmin);

export const AdminRoutes = router;
