import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  // 1. Buscar o admin
  const admin = await prisma.user.findFirst({ where: { email: 'admin@studiotopteamfight.com' } });
  if (!admin) {
    console.error('Admin não encontrado!');
    process.exit(1);
  }

  // 2. Buscar a modalidade Jiu-Jitsu
  const modality = await prisma.modality.findFirst({ where: { name: 'Jiu-Jitsu' } });
  if (!modality) {
    console.error('Modalidade Jiu-Jitsu não encontrada!');
    process.exit(1);
  }

  // 3. Ler arquivos da pasta uploads
  const uploadsDir = path.join(__dirname, '../../uploads');
  const files = fs.readdirSync(uploadsDir);
  if (files.length === 0) {
    console.log('Nenhum arquivo encontrado na pasta uploads.');
    process.exit(0);
  }

  // 4. Para cada arquivo, criar registro na tabela media
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    let fileType: 'IMAGE' | 'VIDEO' | null = null;
    if (imageExtensions.includes(ext)) fileType = 'IMAGE';
    if (videoExtensions.includes(ext)) fileType = 'VIDEO';
    if (!fileType) {
      console.log(`Ignorando arquivo não suportado: ${file}`);
      continue;
    }
    const filePath = path.join(uploadsDir, file);
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    // Verificar se já existe na base
    const exists = await prisma.media.findFirst({ where: { fileUrl: `/uploads/${file}` } });
    if (exists) {
      console.log(`Arquivo já cadastrado: ${file}`);
      continue;
    }
    await prisma.media.create({
      data: {
        modalityId: modality.id,
        uploadedBy: admin.id,
        title: file,
        description: null,
        fileUrl: `/uploads/${file}`,
        fileType,
        fileSize,
        fileName: file,
      },
    });
    console.log(`Importado: ${file}`);
  }
  console.log('Importação concluída!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); }); 