import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/environment.js';
import { validateData, userSchema, loginSchema } from '../utils/validation.js';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validatedData = validateData(userSchema, req.body);

    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(validatedData.password, config.bcryptRounds);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role || 'ALUNO',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      String(config.jwtSecret)
    );

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      data: {
        user,
        token
      }
    });

    return res;

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      });
    }

    console.error('Erro no registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validatedData = validateData(loginSchema, req.body);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        active: true,
      }
    });

    if (!user || !user.active) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      String(config.jwtSecret)
    );

    const { password, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.errors
      });
    }

    console.error('Erro no login:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getProfile = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Buscar o primeiro usuário admin como padrão
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      include: {
        profile: true,
        enrollments: {
          where: { status: 'ACTIVE' },
          include: {
            modality: true,
            plan: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    return res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    // Buscar o primeiro usuário admin como padrão
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    // Se for atualizar email, verificar se já existe
    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email já cadastrado' });
      }
    }

    // Montar dados para atualizar
    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password && password.length >= 6) {
      data.password = await bcrypt.hash(password, config.bcryptRounds);
    }

    // Atualizar usuário
    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    return res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updated
    });
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

export const getAllStudents = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'ALUNO',
        active: true
      },
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Adicionar ID sequencial e calcular idade
    const studentsWithId = students.map((student: any, index: number) => {
      const age = student.profile?.birthDate
        ? Math.floor((Date.now() - new Date(student.profile.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : null;

      return {
        id: String(index + 1).padStart(2, '0'), // ID sequencial: 01, 02, 03...
        userId: student.id,
        name: student.name,
        email: student.email,
        age,
        belt: student.profile?.experience ? extractBeltFromExperience(student.profile.experience) : 'Não informado',
        modality: student.profile?.experience ? extractModalityFromExperience(student.profile.experience) : 'Não informado',
        phone: student.profile?.phone || 'Não informado',
        createdAt: student.createdAt
      };
    });

    return res.json({
      success: true,
      data: studentsWithId
    });

  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Função auxiliar para extrair faixa da experiência
function extractBeltFromExperience(experience: string): string {
  if (!experience || experience.includes('Faixa: ,')) {
    return 'Branca'; // Default para faixa vazia
  }
  if (experience.includes('Faixa:')) {
    const match = experience.match(/Faixa:\s*([^,]+?)(?:\s*,|$)/);
    const belt = match?.[1]?.trim() || '';
    return belt || 'Branca'; // Se a faixa estiver vazia, retorna 'Branca'
  }
  return 'Branca'; // Default
}

// Função auxiliar para extrair modalidade da experiência
function extractModalityFromExperience(experience: string): string {
  if (experience.includes('Modalidade:')) {
    const match = experience.match(/Modalidade:\s*([^,]+)/);
    return match?.[1]?.trim() || 'Não informado';
  }
  return 'Não informado';
} 