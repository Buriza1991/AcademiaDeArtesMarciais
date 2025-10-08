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

  // 3. Ler arquivos da pasta midia (caminho relativo ao projeto)
  const midiaDir = path.join(__dirname, '../../../midia');
  
  if (!fs.existsSync(midiaDir)) {
    console.error('Pasta midia não encontrada!');
    process.exit(1);
  }

  const files = fs.readdirSync(midiaDir);
  if (files.length === 0) {
    console.log('Nenhum arquivo encontrado na pasta midia.');
    process.exit(0);
  }

  console.log(`Encontrados ${files.length} arquivos na pasta midia.`);

  // 4. Para cada arquivo, copiar para uploads e criar registro na tabela media
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  // Criar pasta uploads se não existir
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

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

    const sourcePath = path.join(midiaDir, file);
    const destPath = path.join(uploadsDir, file);
    const stats = fs.statSync(sourcePath);
    const fileSize = stats.size;

    // Verificar se já existe na base
    const exists = await prisma.media.findFirst({ where: { fileUrl: `/uploads/${file}` } });
    if (exists) {
      console.log(`Arquivo já cadastrado: ${file}`);
      continue;
    }

    try {
      // Copiar arquivo para pasta uploads
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Arquivo copiado: ${file}`);

      // Criar registro no banco
      await prisma.media.create({
        data: {
          modalityId: modality.id,
          uploadedBy: admin.id,
          title: file.replace(ext, '').replace(/[_-]/g, ' '), // Remove extensão e substitui _ e - por espaços
          description: `Arquivo importado da pasta midia: ${file}`,
          fileUrl: `/uploads/${file}`,
          fileType,
          fileSize,
          fileName: file,
        },
      });
      console.log(`Importado com sucesso: ${file}`);
    } catch (error) {
      console.error(`Erro ao processar ${file}:`, error);
    }
  }
  
  console.log('Importação concluída!');
  process.exit(0);
}

main().catch(e => { 
  console.error('Erro durante importação:', e); 
  process.exit(1); 
}); 