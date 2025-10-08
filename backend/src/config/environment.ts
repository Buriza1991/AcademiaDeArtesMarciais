import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Servidor
  port: process.env['PORT'] || 3001,
  nodeEnv: process.env['NODE_ENV'] || 'development',
  
  // Banco de dados
  databaseUrl: process.env['DATABASE_URL']!,
  
  // JWT
  jwtSecret: process.env['JWT_SECRET']!,
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] || '7d',
  
  // Email
  email: {
    host: process.env['EMAIL_HOST']!,
    port: parseInt(process.env['EMAIL_PORT'] || '587'),
    user: process.env['EMAIL_USER']!,
    pass: process.env['EMAIL_PASS']!,
  },
  
  // Segurança
  bcryptRounds: parseInt(process.env['BCRYPT_ROUNDS'] || '12'),
  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutos
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '1000'), // Aumentado para 1000 requisições
  },
  
  // URLs
  frontendUrl: process.env['FRONTEND_URL'] || 'http://localhost:5175',
  apiBaseUrl: process.env['API_BASE_URL'] || 'http://localhost:3001/api',
} as const;

// Validação das variáveis obrigatórias
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variável de ambiente obrigatória não encontrada: ${envVar}`);
  }
} 