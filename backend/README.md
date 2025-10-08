# 🥋 Backend - STUDIO TOP TEAM FIGHT

Backend completo para a academia de artes marciais STUDIO TOP TEAM FIGHT com Node.js, Express, TypeScript, Prisma e MySQL.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Linguagem tipada
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de dados
- **Helmet** - Segurança
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Proteção contra spam

## 📋 Pré-requisitos

- Node.js 18+ 
- MySQL 8.0+
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e navegue para o backend:**
```bash
cd backend
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
```

4. **Edite o arquivo `.env` com suas configurações:**
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações do Banco de Dados
DATABASE_URL="mysql://username:password@localhost:3306/academia_db"

# Configurações JWT
JWT_SECRET=sua-chave-secreta-super-segura-aqui
JWT_EXPIRES_IN=7d

# Configurações de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# Configurações de Segurança
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# URLs
FRONTEND_URL=http://localhost:5175
API_BASE_URL=http://localhost:3001/api
```

5. **Configure o banco de dados:**
```bash
# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Executar seed (dados iniciais)
npm run db:seed
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Usuários do sistema
- **profiles** - Perfis dos usuários
- **modalities** - Modalidades de artes marciais
- **plans** - Planos de assinatura
- **enrollments** - Matrículas dos alunos
- **payments** - Pagamentos
- **contacts** - Mensagens de contato
- **schedules** - Agendamentos

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação.

### Endpoints de Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil do usuário (protegido)

### Exemplo de uso:

```bash
# Registrar usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456"
  }'

# Fazer login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "123456"
  }'
```

## 📡 APIs Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário

### Contatos
- `POST /api/contacts` - Criar contato (público)
- `GET /api/contacts` - Listar contatos (admin)
- `GET /api/contacts/:id` - Buscar contato (admin)
- `PATCH /api/contacts/:id/status` - Atualizar status (admin)

### Health Check
- `GET /api/health` - Status do servidor

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Configurado para o frontend
- **Rate Limiting** - Proteção contra spam
- **JWT** - Autenticação segura
- **bcryptjs** - Senhas criptografadas
- **Validação** - Dados validados com Zod

## 👥 Usuários Padrão

Após executar o seed, você terá:

- **Admin**: `admin@studiotopteamfight.com` / `admin123`

## 🗄️ Comandos do Banco

```bash
# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema com banco
npm run db:push

# Criar migration
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio

# Executar seed
npm run db:seed
```

## 📝 Logs

O servidor registra todas as requisições no formato:
```
2024-01-15T10:30:00.000Z - GET /api/health
2024-01-15T10:30:05.000Z - POST /api/auth/login
```

## 🚨 Tratamento de Erros

Todos os erros são tratados e retornam respostas padronizadas:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [] // Detalhes adicionais quando aplicável
}
```

## 🔧 Desenvolvimento

### Estrutura de Pastas
```
src/
├── config/          # Configurações
├── controllers/     # Controladores
├── database/        # Scripts de banco
├── middleware/      # Middlewares
├── routes/          # Rotas
├── utils/           # Utilitários
└── server.ts        # Servidor principal
```

### Adicionando Novas Rotas

1. Crie o controller em `src/controllers/`
2. Crie as rotas em `src/routes/`
3. Importe e registre as rotas em `src/server.ts`

## 📦 Deploy

Para fazer deploy em produção:

1. Configure as variáveis de ambiente
2. Execute `npm run build`
3. Execute `npm start`
4. Configure um proxy reverso (nginx)
5. Configure SSL/TLS

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 