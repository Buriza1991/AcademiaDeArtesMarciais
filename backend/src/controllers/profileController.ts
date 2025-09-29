import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { validateData, profileSchema } from '../utils/validation.js';

export const createProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const validatedData = validateData(profileSchema, req.body);

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar se já existe um perfil para este usuário
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Perfil já existe para este usuário'
      });
    }

    // Criar perfil
    const profile = await prisma.profile.create({
      data: {
        userId,
        phone: validatedData.phone,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        address: validatedData.address,
        emergencyContact: validatedData.emergencyContact,
        emergencyPhone: validatedData.emergencyPhone,
        healthIssues: validatedData.healthIssues,
        experience: validatedData.experience,
        objectives: validatedData.objectives,
      }
    });

    res.status(201).json({
      success: true,
      message: 'Perfil criado com sucesso',
      data: profile
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      });
    }

    console.error('Erro ao criar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const validatedData = validateData(profileSchema, req.body);

    // Verificar se o perfil existe
    const existingProfile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil não encontrado'
      });
    }

    // Atualizar perfil
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        phone: validatedData.phone,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        address: validatedData.address,
        emergencyContact: validatedData.emergencyContact,
        emergencyPhone: validatedData.emergencyPhone,
        healthIssues: validatedData.healthIssues,
        experience: validatedData.experience,
        objectives: validatedData.objectives,
      }
    });

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: profile
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      });
    }

    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil não encontrado'
      });
    }

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}; 