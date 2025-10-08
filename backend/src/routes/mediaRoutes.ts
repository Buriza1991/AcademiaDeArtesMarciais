import { Router } from 'express';
import { MediaController } from '../controllers/mediaController';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

// Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Filtro para tipos de arquivo permitidos
const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo
  }
});

// Todas as rotas são públicas (sem autenticação)
router.get('/modality/:modalityId', MediaController.getMediaByModality);
router.get('/:id', MediaController.getMediaById);
router.post('/upload', upload.single('file'), MediaController.uploadMedia);
router.post('/url', MediaController.addMediaByUrl);
router.get('/', MediaController.getAllMedia);
router.put('/:id', MediaController.updateMedia);
router.delete('/:id', MediaController.deleteMedia);

export default router; 