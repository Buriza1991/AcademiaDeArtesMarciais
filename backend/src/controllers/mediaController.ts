import { Request, Response } from 'express';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../config/database.js';

// Schema de validação para upload de mídia
const uploadMediaSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  modalityId: z.string().min(1, 'Modalidade é obrigatória'),
});

// Schema de validação para atualização de mídia
const updateMediaSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

// Schema de validação para adição de mídia por URL
const addMediaByUrlSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  modalityId: z.string().min(1, 'Modalidade é obrigatória'),
  fileUrl: z.string().url('URL inválida'),
  fileType: z.enum(['IMAGE', 'VIDEO']),
  fileName: z.string().min(1, 'Nome do arquivo é obrigatório'),
  fileSize: z.number().min(0, 'Tamanho do arquivo deve ser maior ou igual a 0'),
});

export class MediaController {
  // Upload de arquivo
  static async uploadMedia(req: AuthRequest, res: Response): Promise<Response> {
    try {
      // Validar dados do formulário
      const formData = uploadMediaSchema.parse(req.body);

      // Verificar se o arquivo foi enviado
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum arquivo foi enviado.',
        });
      }

      // Verificar se a modalidade existe
      const modality = await prisma.modality.findUnique({
        where: { id: formData.modalityId },
      });

      if (!modality) {
        return res.status(404).json({
          success: false,
          message: 'Modalidade não encontrada.',
        });
      }

      // Determinar o tipo de mídia baseado na extensão
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];

      let mediaType: 'IMAGE' | 'VIDEO';
      if (imageExtensions.includes(fileExtension)) {
        mediaType = 'IMAGE';
      } else if (videoExtensions.includes(fileExtension)) {
        mediaType = 'VIDEO';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Tipo de arquivo não suportado. Use apenas imagens (jpg, png, gif, webp) ou vídeos (mp4, avi, mov, wmv, flv, webm).',
        });
      }

      // Criar URL do arquivo (em produção, isso seria uma URL de CDN)
      const fileUrl = `/uploads/${req.file.filename}`;

      // Buscar o id do admin se não houver req.user
      let uploadedBy = req.user?.id;
      if (!uploadedBy) {
        const admin = await prisma.user.findFirst({ where: { email: 'admin@studiotopteamfight.com' } });
        if (!admin) {
          return res.status(500).json({ success: false, message: 'Usuário admin não encontrado para upload anônimo.' });
        }
        uploadedBy = admin.id;
      }

      // Salvar no banco de dados
      const media = await prisma.media.create({
        data: {
          modalityId: formData.modalityId,
          uploadedBy,
          title: formData.title,
          description: formData.description || null,
          fileUrl,
          fileType: mediaType,
          fileSize: req.file.size,
          fileName: req.file.originalname,
        },
        include: {
          modality: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Mídia enviada com sucesso!',
        data: media,
      });
    } catch (error) {
      console.error('Erro no upload de mídia:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Listar mídia por modalidade
  static async getMediaByModality(req: Request, res: Response): Promise<Response> {
    try {
      const { modalityId } = req.params;
      
      if (!modalityId) {
        return res.status(400).json({
          success: false,
          message: 'ID da modalidade é obrigatório.',
        });
      }

      const { type, page = 1, limit = 20 } = req.query;

      // Verificar se a modalidade existe
      const modality = await prisma.modality.findUnique({
        where: { id: modalityId },
      });

      if (!modality) {
        return res.status(404).json({
          success: false,
          message: 'Modalidade não encontrada.',
        });
      }

      // Construir filtros
      const where: any = {
        modalityId,
        active: true,
      };

      if (type && (type === 'IMAGE' || type === 'VIDEO')) {
        where.fileType = type;
      }

      // Calcular paginação
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Buscar mídia
      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          include: {
            modality: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take,
        }),
        prisma.media.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      return res.json({
        success: true,
        data: {
          media,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error('Erro ao buscar mídia:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Listar toda a mídia (público)
  static async getAllMedia(req: Request, res: Response): Promise<Response> {
    try {
      const { type, modalityId, page = 1, limit = 20 } = req.query;

      // Construir filtros
      const where: any = {
        active: true,
      };

      if (type && (type === 'IMAGE' || type === 'VIDEO')) {
        where.fileType = type;
      }

      if (modalityId) {
        where.modalityId = modalityId;
      }

      // Calcular paginação
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);

      // Buscar mídia
      const [media, total] = await Promise.all([
        prisma.media.findMany({
          where,
          include: {
            modality: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take,
        }),
        prisma.media.count({ where }),
      ]);

      const totalPages = Math.ceil(total / take);

      return res.json({
        success: true,
        data: {
          media,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages,
          },
        },
      });
    } catch (error) {
      console.error('Erro ao buscar mídia:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Buscar mídia por ID
  static async getMediaById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da mídia é obrigatório.',
        });
      }

      const media = await prisma.media.findUnique({
        where: { id },
        include: {
          modality: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Mídia não encontrada.',
        });
      }

      return res.json({
        success: true,
        data: media,
      });
    } catch (error) {
      console.error('Erro ao buscar mídia:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Atualizar mídia
  static async updateMedia(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da mídia é obrigatório.',
        });
      }

      const updateData = updateMediaSchema.parse(req.body);

      // Verificar se a mídia existe
      const existingMedia = await prisma.media.findUnique({
        where: { id },
      });

      if (!existingMedia) {
        return res.status(404).json({
          success: false,
          message: 'Mídia não encontrada.',
        });
      }

      // Filtrar dados válidos para update
      const dataToUpdate: any = {};
      if (updateData.title !== undefined) dataToUpdate.title = updateData.title;
      if (updateData.description !== undefined) dataToUpdate.description = updateData.description;
      if (updateData.active !== undefined) dataToUpdate.active = updateData.active;

      // Atualizar mídia
      const media = await prisma.media.update({
        where: { id },
        data: dataToUpdate,
        include: {
          modality: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.json({
        success: true,
        message: 'Mídia atualizada com sucesso!',
        data: media,
      });
    } catch (error) {
      console.error('Erro ao atualizar mídia:', error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Deletar mídia
  static async deleteMedia(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da mídia é obrigatório.',
        });
      }

      // Verificar se a mídia existe
      const media = await prisma.media.findUnique({
        where: { id },
      });

      if (!media) {
        return res.status(404).json({
          success: false,
          message: 'Mídia não encontrada.',
        });
      }

      // Deletar arquivo físico (se existir)
      const filePath = path.join(process.cwd(), 'uploads', path.basename(media.fileUrl));
      const unlinkAsync = promisify(fs.unlink);
      
      try {
        await unlinkAsync(filePath);
      } catch (fileError) {
        console.warn('Arquivo não encontrado para deletar:', filePath);
      }

      // Deletar do banco de dados
      await prisma.media.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Mídia deletada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao deletar mídia:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }

  // Adicionar mídia por URL
  static async addMediaByUrl(req: AuthRequest, res: Response): Promise<Response> {
    try {
      // Validar dados
      const formData = addMediaByUrlSchema.parse(req.body);

      // Verificar se a modalidade existe
      const modality = await prisma.modality.findUnique({
        where: { id: formData.modalityId },
      });

      if (!modality) {
        return res.status(404).json({
          success: false,
          message: 'Modalidade não encontrada.',
        });
      }

      // Buscar o id do admin se não houver req.user
      let uploadedBy = req.user?.id;
      if (!uploadedBy) {
        const admin = await prisma.user.findFirst({ where: { email: 'admin@studiotopteamfight.com' } });
        if (!admin) {
          return res.status(500).json({ success: false, message: 'Usuário admin não encontrado para upload anônimo.' });
        }
        uploadedBy = admin.id;
      }

      // Salvar no banco de dados
      const media = await prisma.media.create({
        data: {
          modalityId: formData.modalityId,
          uploadedBy,
          title: formData.title,
          description: formData.description || null,
          fileUrl: formData.fileUrl,
          fileType: formData.fileType,
          fileSize: formData.fileSize,
          fileName: formData.fileName,
        },
        include: {
          modality: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Mídia adicionada com sucesso!',
        data: media,
      });
    } catch (error) {
      console.error('Erro ao adicionar mídia por URL:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
      });
    }
  }
} 