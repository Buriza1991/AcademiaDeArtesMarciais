# Studio Top Team Fight - Docker Setup

Este documento contém as instruções para executar o projeto Studio Top Team Fight usando Docker.

## Pré-requisitos

- Docker Desktop instalado e rodando
- Docker Compose (incluído no Docker Desktop)

## Estrutura do Projeto

O projeto está dividido em dois serviços principais:

1. **Frontend**: React + Vite (porta 5175)
2. **Backend**: Node.js + Express + Prisma + SQLite (porta 3001)

## Opções de Execução

### Opção 1: Scripts Automatizados (Recomendado)

#### Windows (PowerShell)
```powershell
# Execute o script PowerShell
.\start-docker.ps1
```

#### Windows (CMD)
```cmd
# Execute o script batch
start-docker.bat
```

### Opção 2: Comandos Manuais

#### Desenvolvimento (com hot reload)
```bash
# Usar configuração de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build
```

#### Produção
```bash
# Usar configuração de produção
docker-compose up --build
```

## Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Antes de executar, você precisa configurar as variáveis de ambiente para o backend. Crie um arquivo `.env` na pasta `backend/`:

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:5175
API_BASE_URL=http://localhost:3001/api
```

**Importante**: 
- Substitua `your-email@gmail.com` e `your-app-password` pelos dados do seu email
- Para Gmail, você precisará usar uma "Senha de App" em vez da senha normal
- Altere o `JWT_SECRET` para uma chave segura em produção

### 2. Executar o Projeto

No diretório raiz do projeto, execute:

```bash
# Desenvolvimento (com hot reload)
docker-compose -f docker-compose.dev.yml up --build

# Produção
docker-compose up --build

# Para executar em background
docker-compose up -d --build

# Para parar os serviços
docker-compose down

# Para parar e remover volumes
docker-compose down -v
```

### 3. Acessar a Aplicação

- **Frontend**: http://localhost:5175
- **Backend API**: http://localhost:3001/api

## Comandos Úteis

### Ver logs dos serviços
```bash
# Todos os serviços
docker-compose logs

# Serviço específico
docker-compose logs frontend
docker-compose logs backend

# Logs em tempo real
docker-compose logs -f
```

### Executar comandos dentro dos containers
```bash
# Backend
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
docker-compose exec backend npx prisma studio

# Frontend
docker-compose exec frontend npm run build
```

### Reconstruir um serviço específico
```bash
docker-compose up --build backend
docker-compose up --build frontend
```

## Desenvolvimento

### Hot Reload

Os volumes estão configurados para permitir hot reload:

- Mudanças no código do frontend serão refletidas automaticamente
- Mudanças no código do backend reiniciarão o servidor automaticamente

### Banco de Dados

O SQLite está configurado como volume, então os dados persistirão entre as execuções dos containers.

Para resetar o banco:
```bash
docker-compose down
docker volume rm project_dev.db
docker-compose up --build
```

### Uploads

A pasta `uploads/` do backend está montada como volume, então os arquivos enviados persistirão entre as execuções.

## Troubleshooting

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar processos usando as portas
   netstat -ano | findstr :5175
   netstat -ano | findstr :3001
   
   # Parar processo específico (substitua PID pelo número do processo)
   taskkill /PID <PID> /F
   ```

2. **Erro de permissão no Windows**
   - Certifique-se de que o Docker Desktop tem permissão para acessar os arquivos
   - Execute o PowerShell como administrador

3. **Container não inicia**
   ```bash
   # Verificar logs detalhados
   docker-compose logs backend
   docker-compose logs frontend
   
   # Reconstruir sem cache
   docker-compose build --no-cache
   ```

4. **Problemas de rede**
   ```bash
   # Verificar redes Docker
   docker network ls
   
   # Remover rede e recriar
   docker-compose down
   docker network prune
   docker-compose up --build
   ```

### Logs de Erro

Se encontrar problemas, verifique os logs:

```bash
# Logs do backend
docker-compose logs backend

# Logs do frontend
docker-compose logs frontend

# Logs de todos os serviços
docker-compose logs
```

## Diferenças entre Desenvolvimento e Produção

### Desenvolvimento (`docker-compose.dev.yml`)
- Hot reload ativo
- Volumes montados para código fonte
- Variáveis de ambiente simplificadas
- Logs mais detalhados

### Produção (`docker-compose.yml`)
- Build otimizado
- Nginx como servidor web
- Configurações de segurança
- Performance otimizada

## Produção

Para ambiente de produção, considere:

1. Usar variáveis de ambiente seguras
2. Configurar HTTPS
3. Usar um banco de dados mais robusto (PostgreSQL, MySQL)
4. Configurar backup automático
5. Usar um proxy reverso (Nginx)
6. Configurar monitoramento e logs

## Estrutura de Arquivos Docker

```
project/
├── docker-compose.yml              # Produção
├── docker-compose.dev.yml          # Desenvolvimento
├── Dockerfile.frontend             # Frontend (produção)
├── Dockerfile.frontend.dev         # Frontend (desenvolvimento)
├── nginx.conf                      # Configuração do Nginx
├── .dockerignore                   # Arquivos ignorados no build
├── start-docker.bat                # Script Windows (CMD)
├── start-docker.ps1                # Script Windows (PowerShell)
├── backend/
│   ├── Dockerfile.backend          # Backend (produção)
│   ├── Dockerfile.backend.dev      # Backend (desenvolvimento)
│   └── .dockerignore               # Arquivos ignorados no build do backend
└── README-Docker.md                # Este arquivo
``` 