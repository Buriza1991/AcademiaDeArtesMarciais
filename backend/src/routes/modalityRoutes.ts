import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Buscar todas as modalidades
router.get('/', async (_req, res) => {
  try {
    const modalities = await prisma.modality.findMany({
      where: {
        active: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        minAge: true,
        duration: true
      }
    });

    res.json({
      success: true,
      message: 'Modalidades encontradas com sucesso',
      data: modalities
    });
  } catch (error) {
    console.error('Erro ao buscar modalidades:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Buscar modalidade por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const modality = await prisma.modality.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        videoUrl: true,
        benefits: true,
        minAge: true,
        duration: true,
        active: true
      }
    });

    if (!modality) {
      return res.status(404).json({
        success: false,
        message: 'Modalidade não encontrada'
      });
    }

    return res.json({
      success: true,
      message: 'Modalidade encontrada com sucesso',
      data: modality
    });
  } catch (error) {
    console.error('Erro ao buscar modalidade:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
