import { Router } from 'express';
import { 
  createContact, 
  getAllContacts, 
  getContactById, 
  updateContactStatus,
  getContactsByModality
} from '../controllers/contactController.js';

const router = Router();

// Todas as rotas são públicas (sem autenticação)
router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);
router.get('/by-modality', getContactsByModality);

export default router; 