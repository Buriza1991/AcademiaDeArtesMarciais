# 🥋 STUDIO TOP TEAM FIGHT

Sistema completo para academia de artes marciais STUDIO TOP TEAM FIGHT com frontend React e backend Node.js.

## 🚀 Visão Geral

Este projeto é uma aplicação web completa para gerenciamento de academia de artes marciais, incluindo:

- **Frontend**: Interface moderna com React + TypeScript + Tailwind CSS
- **Backend**: API RESTful com Node.js + Express + TypeScript
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: JWT com bcrypt
- **Validação**: Zod para validação de dados
- **Segurança**: Helmet, CORS, Rate Limiting

## 📁 Estrutura do Projeto

```
project/
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── services/           # Serviços de API
│   └── ...
├── backend/                # Backend Node.js
│   ├── src/
│   │   ├── config/         # Configurações
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── routes/         # Rotas
│   │   └── ...
│   ├── prisma/             # Schema do banco
│   └── ...
└── README.md
```

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS
- **Vite** - Build tool
- **Lucide React** - Ícones
- **React Intersection Observer** - Animações

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia
- **Zod** - Validação
- **Helmet** - Segurança

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🚀 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd project
```

### 2. Configurar Frontend
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### 3. Configurar Backend
```bash
cd backend

# Executar script de setup (Linux/Mac)
chmod +x setup.sh
./setup.sh

# Ou configurar manualmente:
npm install
cp env.example .env
# Editar .env com suas configurações
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### 4. Configurar Banco de Dados

1. **Instalar MySQL**
2. **Criar banco de dados:**
```sql
CREATE DATABASE academia_db;
```
3. **Configurar DATABASE_URL no .env:**
```env
DATABASE_URL="mysql://username:password@localhost:3306/academia_db"
```

## 🏃‍♂️ Executando o Projeto

### Desenvolvimento

**Terminal 1 - Frontend:**
```bash
npm run dev
# Frontend rodará em http://localhost:5175
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
# Backend rodará em http://localhost:3001
```

### Produção

**Frontend:**
```bash
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm run build
npm start
```

## 📊 Funcionalidades

### Frontend
- ✅ Página inicial responsiva
- ✅ Seção de modalidades
- ✅ Galeria de fotos
- ✅ Planos e preços
- ✅ Formulário de cadastro
- ✅ Formulário de contato
- ✅ Seção sobre a academia
- ✅ Animações suaves
- ✅ Design moderno

### Backend
- ✅ API RESTful
- ✅ Autenticação JWT
- ✅ CRUD de usuários
- ✅ CRUD de contatos
- ✅ Validação de dados
- ✅ Segurança implementada
- ✅ Banco de dados estruturado
- ✅ Seed de dados iniciais

## 🔐 Autenticação

O sistema utiliza JWT para autenticação:

### Usuários Padrão
- **Admin**: `admin@studiotopteamfight.com` / `admin123`

### Endpoints de Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Perfil do usuário

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

## 🗄️ Banco de Dados

### Tabelas Principais
- **users** - Usuários do sistema
- **profiles** - Perfis dos usuários
- **modalities** - Modalidades de artes marciais
- **plans** - Planos de assinatura
- **enrollments** - Matrículas dos alunos
- **payments** - Pagamentos
- **contacts** - Mensagens de contato
- **schedules** - Agendamentos

### Comandos do Banco
```bash
cd backend

# Gerar cliente Prisma
npm run db:generate

# Sincronizar schema
npm run db:push

# Criar migration
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio

# Executar seed
npm run db:seed
```

## 🔒 Segurança

- **Helmet** - Headers de segurança
- **CORS** - Configurado para o frontend
- **Rate Limiting** - Proteção contra spam
- **JWT** - Autenticação segura
- **bcryptjs** - Senhas criptografadas
- **Validação** - Dados validados com Zod

## 🎨 Design System

O projeto utiliza Tailwind CSS com:
- Cores personalizadas (vermelho/amarelo)
- Animações suaves
- Design responsivo
- Componentes reutilizáveis

## 📱 Responsividade

O frontend é totalmente responsivo:
- Mobile First
- Breakpoints: sm, md, lg, xl
- Componentes adaptáveis

## 🚨 Tratamento de Erros

### Frontend
- Validação de formulários
- Feedback visual de erros
- Loading states

### Backend
- Validação com Zod
- Middleware de tratamento de erros
- Logs estruturados
- Respostas padronizadas

## 📝 Logs

### Frontend
- Console logs para desenvolvimento
- Error boundaries

### Backend
- Logs de requisições
- Logs de erros
- Timestamps ISO

## 🔧 Desenvolvimento

### Estrutura de Pastas Frontend
```
src/
├── components/     # Componentes React
├── services/       # Serviços de API
└── ...
```

### Estrutura de Pastas Backend
```
backend/src/
├── config/         # Configurações
├── controllers/    # Controladores
├── database/       # Scripts de banco
├── middleware/     # Middlewares
├── routes/         # Rotas
├── utils/          # Utilitários
└── server.ts       # Servidor principal
```

## 🧪 Testes

Para implementar testes:

### Frontend
```bash
npm install --save-dev vitest @testing-library/react
```

### Backend
```bash
cd backend
npm install --save-dev jest @types/jest supertest
```

## 📦 Deploy

### Frontend (Vercel/Netlify)
```bash
npm run build
# Fazer upload da pasta dist/
```

### Backend (Railway/Heroku)
```bash
cd backend
npm run build
npm start
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os READMEs específicos
3. Abra uma issue no repositório

## 🎯 Próximos Passos

### Fase 2 - Funcionalidades Avançadas
- [ ] Sistema de pagamentos (Stripe/PayPal)
- [ ] Dashboard administrativo
- [ ] Sistema de agendamento
- [ ] Notificações por email
- [ ] Upload de imagens
- [ ] Relatórios e analytics

### Fase 3 - Otimizações
- [ ] Cache e performance
- [ ] Testes automatizados
- [ ] CI/CD pipeline
- [ ] Monitoramento
- [ ] Backup automático

---

**Desenvolvido com ❤️ para o STUDIO TOP TEAM FIGHT** 