import { z } from 'zod';

// Schemas de validação
export const userSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'INSTRUTOR', 'ALUNO']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const profileSchema = z.object({
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  healthIssues: z.string().optional(),
  experience: z.string().optional(),
  objectives: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Assunto deve ter pelo menos 3 caracteres'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export const enrollmentSchema = z.object({
  modalityId: z.string().min(1, 'Modalidade é obrigatória'),
  planId: z.string().min(1, 'Plano é obrigatório'),
});

export const scheduleSchema = z.object({
  modalityId: z.string().min(1, 'Modalidade é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  time: z.string().min(1, 'Horário é obrigatório'),
  notes: z.string().optional(),
});

// Função para validar dados
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};

// Função para validar dados de forma segura (não lança erro)
export const validateDataSafe = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  return schema.safeParse(data);
}; 