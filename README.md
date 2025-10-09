# 🥋 STUDIO TOP TEAM FIGHT - Sistema de Gestão de Academia

<div align="center">

![React](https://img.shields.io/badge/React-18.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

## 🚀 Sobre o Projeto

Sistema web completo para gestão de academia de artes marciais, desenvolvido com tecnologias modernas e arquitetura full-stack. O projeto inclui funcionalidades de cadastro de alunos, sistema de graduação por faixas, captura de fotos, gestão de pagamentos e muito mais.

### 🎯 Funcionalidades Principais

✅ **Sistema de Cadastro Completo** - Registro de alunos com captura de foto via webcam  
✅ **Sistema de Graduação** - Gestão de faixas com cores autênticas do Jiu-Jitsu  
✅ **Gestão de Pagamentos** - Simulação de pagamentos (Cartão, PIX, Boleto)  
✅ **Galeria de Modalidades** - Showcase das artes marciais oferecidas  
✅ **Sistema de Contato** - Formulário para comunicação  
✅ **Interface Responsiva** - Design adaptável para todos os dispositivos  
✅ **Autenticação JWT** - Sistema seguro de login e registro  
✅ **Containerização** - Deploy facilitado com Docker  

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** + **TypeScript** - Interface moderna e tipagem segura
- **Tailwind CSS** - Estilização utilitária e responsiva
- **Vite** - Build tool rápida e eficiente
- **React Router** - Navegação entre páginas
- **Lucide React** - Biblioteca de ícones
- **React Intersection Observer** - Animações on-scroll

### Backend
- **Node.js** + **Express** - Servidor RESTful
- **TypeScript** - Tipagem end-to-end
- **Prisma ORM** - Modelagem e queries do banco
- **SQLite** - Banco de dados local
- **JWT** - Autenticação stateless
- **bcryptjs** - Criptografia de senhas
- **Zod** - Validação de schemas

### DevOps & Tools
- **Docker** + **Docker Compose** - Containerização
- **Git** - Controle de versão
- **ESLint** - Linting de código
- **Prettier** - Formatação automática

## 📁 Estrutura do Projeto

```
📦 studio-top-team-fight/
├── 🎨 src/                          # Frontend React
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── Header.tsx              # Cabeçalho com navegação
│   │   ├── Hero.tsx                # Seção principal
│   │   ├── Cadastro.tsx            # Formulário com captura de foto
│   │   ├── AlunosCadastrados.tsx   # Lista de alunos com fotos
│   │   ├── Planos.tsx              # Planos e preços
│   │   ├── Galeria.tsx             # Galeria de modalidades
│   │   └── ...                     # Outros componentes
│   ├── services/                   # Serviços de API
│   └── assets/                     # Imagens e recursos
├── ⚙️ backend/                      # Backend Node.js
│   ├── src/
│   │   ├── controllers/            # Lógica de negócio
│   │   ├── middleware/             # Middlewares personalizados
│   │   ├── routes/                 # Definição de rotas
│   │   ├── config/                 # Configurações
│   │   └── utils/                  # Utilitários
│   ├── prisma/                     # Schema e migrações
│   │   ├── schema.prisma          # Modelo do banco
│   │   ├── dev.db                 # Banco SQLite
│   │   └── migrations/            # Histórico de migrações
│   └── uploads/                    # Arquivos enviados
├── 🐳 docker-compose.yml           # Orquestração de containers
├── 📋 package.json                 # Dependencies do frontend
└── 📖 README.md                    # Este arquivo
```

## 🚀 Como Executar

### Pré-requisitos
- **Docker** e **Docker Compose** instalados
- **Git** para clonagem do repositório

### 1. Clone o Repositório
```bash
git clone https://github.com/Buriza1991/AcademiaDeArtesMarciais.git
cd AcademiaDeArtesMarciais
```

### 2. Execute com Docker (Recomendado)
```bash
# Construir e iniciar todos os serviços
docker-compose up -d

# Verificar status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f
```

### 3. Acesse a Aplicação
- **Frontend:** http://localhost:5175
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

### 4. Parar os Serviços
```bash
docker-compose down
```

## 🗄️ Banco de Dados

### Visualizar Dados - Prisma Studio
```bash
# Abrir interface gráfica do banco
docker-compose exec backend npx prisma studio
# Acesse: http://localhost:5555
```

### Visualizar Dados - DB Browser (Alternativa)
```bash
# Copiar banco para visualização local
docker cp project-backend-1:/app/prisma/dev.db ./banco_academia.db
# Abra o arquivo no DB Browser for SQLite
```

### Schema do Banco
```sql
-- Principais tabelas
users       -- Usuários (Admin, Alunos)
profiles    -- Perfis detalhados dos usuários  
modalities  -- Modalidades de artes marciais
plans       -- Planos de assinatura
enrollments -- Matrículas dos alunos
payments    -- Histórico de pagamentos
contacts    -- Mensagens de contato
schedules   -- Agendamentos de aulas
media       -- Fotos e vídeos enviados
```

## 🔐 Autenticação

### Usuários Pré-configurados
```
Admin: admin@studiotopteamfight.com / admin123
```

### Endpoints de API
```bash
POST /api/auth/register    # Cadastro de usuário
POST /api/auth/login       # Login
GET  /api/auth/profile     # Perfil do usuário
GET  /api/contacts         # Listar contatos (admin)
POST /api/contacts         # Enviar mensagem
GET  /api/health          # Status do servidor
```

## 🎨 Design System

### Paleta de Cores
- **Primária:** Preto (`#000000`) e Vermelho (`#DC2626`)
- **Secundária:** Branco (`#FFFFFF`) e Cinza (`#374151`)
- **Gradientes:** Preto → Vermelho para fundos dinâmicos

### Responsividade
- **Mobile First:** Optimizado para dispositivos móveis
- **Breakpoints:** `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- **Layout Flexível:** Grid e Flexbox para adaptabilidade

## 📱 Funcionalidades Detalhadas

### 🎯 Captura de Fotos
- Acesso à webcam para selfies
- Preview em tempo real
- Armazenamento seguro das imagens
- Exibição na lista de alunos

### 🥋 Sistema de Faixas
- Cores autênticas do Jiu-Jitsu
- Faixas infantis com graduações mistas
- Visual dinâmico com gradientes

### 💳 Simulação de Pagamentos
- Interface para Cartão de Crédito
- Opção PIX com QR Code
- Boleto bancário tradicional
- Fluxo completo até confirmação

### 📊 Dashboard Administrativo
- Lista completa de alunos cadastrados
- Filtros por faixa e status
- Informações detalhadas dos perfis
- Gestão de contatos recebidos

## 🔧 Desenvolvimento

### Executar em Modo de Desenvolvimento
```bash
# Frontend (com hot reload)
npm run dev

# Backend (separadamente se necessário)
cd backend && npm run dev
```

### Scripts Disponíveis
```bash
# Frontend
npm run dev        # Servidor de desenvolvimento
npm run build      # Build para produção
npm run preview    # Preview do build

# Backend
npm run dev        # Servidor com hot reload
npm run build      # Compilar TypeScript
npm run start      # Executar build de produção
```

## 🐳 Docker

### Comandos Úteis
```bash
# Rebuild completo (após mudanças)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Rebuild apenas frontend
docker-compose build --no-cache frontend

# Ver logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend

# Executar comandos dentro do container
docker-compose exec backend npm run prisma:studio
docker-compose exec backend sh  # Acesso shell
```

## 📈 Melhorias Futuras

### 🎯 Roadmap Técnico
- [ ] **Testes Automatizados** - Jest + Testing Library
- [ ] **CI/CD Pipeline** - GitHub Actions
- [ ] **Monitoramento** - Logs estruturados e métricas
- [ ] **Cache** - Redis para performance
- [ ] **Deploy Cloud** - AWS/Digital Ocean

### 🎯 Roadmap Funcional
- [ ] **Pagamentos Reais** - Integração Stripe/Mercado Pago
- [ ] **Sistema de Agendamento** - Calendário interativo

- [ ] **Notificações** - Email e Push notifications
- [ ] **Relatórios** - Analytics e dashboards
- [ ] **Sistema de Graduação** - Workflow completo de promoções

## 🤝 Contribuição

### Como Contribuir
1. **Fork** o repositório
2. **Clone** sua fork localmente
3. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
4. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
5. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
6. **Abra** um Pull Request

### Padrões de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: mudanças de formatação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Sobre o Desenvolvedor

Projeto desenvolvido como parte do aprendizado em **desenvolvimento full-stack**, combinando conhecimentos de:
- **Quality Assurance (QA)** - Experiência profissional
- **Frontend Development** - React e TypeScript
- **Backend Development** - Node.js e APIs RESTful
- **DevOps** - Docker e containerização

Esta experiência demonstra a evolução de um profissional de QA para um desenvolvedor full-stack, aplicando boas práticas de qualidade em todas as camadas da aplicação.

## 🆘 Suporte

### Problemas Comuns
- **Porta ocupada:** Altere as portas no `docker-compose.yml`
- **Containers não sobem:** Execute `docker-compose down` e `docker-compose up -d`
- **Banco não conecta:** Verifique se o container backend está executando

### Contato
- **GitHub:** [Buriza1991](https://github.com/Buriza1991)
- **LinkedIn:** [Seu LinkedIn]
- **Email:** brenoaguiar2014@gmail.com

---

<div align="center">

**🥋 Desenvolvido com paixão para o mundo das Artes Marciais 🥋**

</div> 