import { Router } from 'express';
import { register, login, getProfile, updateProfile, getAllStudents } from '../controllers/authController.js';

const router = Router();

// Todas as rotas são públicas (sem autenticação)
router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/students', getAllStudents);

export default router; 