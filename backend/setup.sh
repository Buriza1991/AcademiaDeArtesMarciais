#!/bin/bash

echo "🥋 Configurando Backend - STUDIO TOP TEAM FIGHT"
echo "================================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# Copiar arquivo de ambiente
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado"
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações antes de continuar!"
    echo "   Especialmente a DATABASE_URL para conectar ao seu MySQL"
    echo ""
    echo "Pressione Enter quando tiver configurado o .env..."
    read
else
    echo "✅ Arquivo .env já existe"
fi

# Gerar cliente Prisma
echo "🗄️  Gerando cliente Prisma..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar cliente Prisma"
    exit 1
fi

echo "✅ Cliente Prisma gerado"

# Verificar se o banco está configurado
echo "🔍 Verificando conexão com banco de dados..."
npm run db:push > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Erro ao conectar com banco de dados"
    echo "   Verifique se:"
    echo "   1. MySQL está rodando"
    echo "   2. DATABASE_URL está configurada corretamente no .env"
    echo "   3. O banco de dados existe"
    echo ""
    echo "Exemplo de DATABASE_URL:"
    echo "   DATABASE_URL=\"mysql://username:password@localhost:3306/academia_db\""
    echo ""
    echo "Pressione Enter quando tiver configurado o banco..."
    read
    
    # Tentar novamente
    echo "🔄 Tentando conectar novamente..."
    npm run db:push
    
    if [ $? -ne 0 ]; then
        echo "❌ Ainda não foi possível conectar ao banco"
        exit 1
    fi
fi

echo "✅ Conexão com banco estabelecida"

# Executar seed
echo "🌱 Executando seed do banco..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Erro ao executar seed"
    exit 1
fi

echo "✅ Seed executado com sucesso"

# Verificar se tudo está funcionando
echo "🧪 Testando servidor..."
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

sleep 3

if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Servidor funcionando corretamente"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Servidor não está respondendo"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Resumo da configuração:"
echo "   ✅ Dependências instaladas"
echo "   ✅ Arquivo .env configurado"
echo "   ✅ Cliente Prisma gerado"
echo "   ✅ Banco de dados conectado"
echo "   ✅ Dados iniciais carregados"
echo "   ✅ Servidor testado"
echo ""
echo "🚀 Para iniciar o servidor:"
echo "   npm run dev"
echo ""
echo "📊 Para acessar o Prisma Studio:"
echo "   npm run db:studio"
echo ""
echo "👤 Usuário admin criado:"
echo "   Email: admin@studiotopteamfight.com"
echo "   Senha: admin123"
echo ""
echo "🌐 Frontend deve estar rodando em: http://localhost:5175"
echo "🔧 Backend estará rodando em: http://localhost:3001"
echo ""
echo "Boa sorte com o STUDIO TOP TEAM FIGHT! 🥋" 