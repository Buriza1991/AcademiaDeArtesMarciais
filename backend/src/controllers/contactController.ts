import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { validateData, contactSchema } from '../utils/validation.js';

export const createContact = async (req: Request, res: Response): Promise<Response> => {
  try {
    const validatedData = validateData(contactSchema, req.body);

    const contactData: any = {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      subject: validatedData.subject,
      message: validatedData.message
    };
    if ((req as any).user?.id !== undefined) {
      contactData.userId = (req as any).user.id;
    }

    const contact = await prisma.contact.create({
      data: contactData
    });

    return res.status(201).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
      data: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
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

    console.error('Erro ao criar contato:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = status ? { status: status as any } : {};

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Erro ao buscar contatos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do contato não fornecido'
      });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true

          }
        }
      }
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contato não encontrado'
        
      });
    }

    res.json({
      success: true,
      data: contact
    });
    return;

  } catch (error) {
    console.error('Erro ao buscar contato:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
    return;
  }
};

export const updateContactStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID do contato não fornecido'
      });
    }

    const contact = await prisma.contact.update({
      where: { id: id as string },
      data: { status: status as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Status do contato atualizado com sucesso',
      data: contact
    });

  } catch (error) {
    console.error('Erro ao atualizar contato:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

export const getContactsByModality = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const contacts = await prisma.contact.findMany();
    const grouped = contacts.reduce((acc, contact) => {
      const match = contact.subject ? contact.subject.match(/Modalidade: ([^|]+)/) : null;
      const modalidade = match?.[1]?.trim() ?? "Não informada";
      if (!acc[modalidade]) acc[modalidade] = [];
      acc[modalidade].push(contact);
      return acc;
    }, {} as Record<string, typeof contacts>);
    return res.json({ success: true, data: grouped });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erro ao buscar contatos por modalidade" });
  }
}; 