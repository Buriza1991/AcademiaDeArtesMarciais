import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { config } from '../config/environment.js';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', config.bcryptRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@studiotopteamfight.com' },
    update: {},
    create: {
      email: 'admin@studiotopteamfight.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Criar modalidades
  const modalities = await Promise.all([
    
      
    
    prisma.modality.upsert({
      where: { name: 'Jiu-Jitsu' },
      update: {},
      create: {
        name: 'Jiu-Jitsu',
        description: 'Arte suave brasileira que ensina como usar a técnica para vencer oponentes maiores.',
        image: 'https://images.pexels.com/photos/7045718/pexels-photo-7045718.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        benefits: JSON.stringify(['Técnica refinada', 'Estratégia', 'Flexibilidade', 'Autoconfiança']),
        minAge: 6,
        duration: 90,
      },
    }),
    prisma.modality.upsert({
      where: { name: 'Muay Thai' },
      update: {},
      create: {
        name: 'Muay Thai',
        description: 'A arte das oito armas, combinando punhos, cotovelos, joelhos e canelas.',
        image: 'https://images.pexels.com/photos/4761663/pexels-photo-4761663.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        benefits: JSON.stringify(['Condicionamento intenso', 'Força', 'Resistência', 'Coordenação']),
        minAge: 12,
        duration: 75,
      },
    }),

    prisma.modality.upsert({
      where: { name: 'MMA' },
      update: {},
      create: {
        name: 'MMA',
        description: 'Artes marciais mistas combinando as melhores técnicas de várias modalidades.',
        image: 'https://images.pexels.com/photos/4761662/pexels-photo-4761662.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        benefits: JSON.stringify(['Versatilidade', 'Condicionamento completo', 'Competição', 'Adaptabilidade']),
        minAge: 16,
        duration: 90,
      },
    }),
   
  ]);

  // Criar planos
  const plans = await Promise.all([
    prisma.plan.upsert({
      where: { name: 'Básico' },
      update: {},
      create: {
        name: 'Básico',
        description: 'Perfeito para iniciantes',
        price: 89.00,
        period: 'month',
        features: JSON.stringify([
          '2x por semana',
          '1 modalidade',
          'Acesso ao vestiário',
          'Acompanhamento básico',
          'Certificado de participação'
        ]),
        popular: false,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Premium' },
      update: {},
      create: {
        name: 'Premium',
        description: 'Mais popular entre nossos alunos',
        price: 149.00,
        period: 'month',
        features: JSON.stringify([
          'Acesso ilimitado',
          '3 modalidades',
          'Aulas personalizadas',
          'Acompanhamento nutricional',
          'Acesso a eventos',
          'Kit de uniforme',
          'Desconto em produtos'
        ]),
        popular: true,
      },
    }),
    prisma.plan.upsert({
      where: { name: 'Elite' },
      update: {},
      create: {
        name: 'Elite',
        description: 'Para atletas dedicados',
        price: 249.00,
        period: 'month',
        features: JSON.stringify([
          'Acesso total VIP',
          'Todas as modalidades',
          'Treino personalizado',
          'Preparação para competições',
          'Acompanhamento médico',
          'Suplementação inclusa',
          'Acesso prioritário',
          'Mentoria individual'
        ]),
        popular: false,
      },
    }),
  ]);

  console.log('✅ Seed concluído com sucesso!');
  console.log(`👤 Admin criado: ${admin.email}`);
  console.log(`🥋 Modalidades criadas: ${modalities.length}`);
  console.log(`💳 Planos criados: ${plans.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 