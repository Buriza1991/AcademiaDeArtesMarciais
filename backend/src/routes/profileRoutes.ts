import { Router } from 'express';
import { createProfile, updateProfile, getProfile } from '../controllers/profileController.js';

const router = Router();

// Rotas de perfil
router.post('/', createProfile);
router.put('/:userId', updateProfile);
router.get('/:userId', getProfile);

export default router; 