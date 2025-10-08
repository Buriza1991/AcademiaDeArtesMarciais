# Studio Top Team Fight - Docker Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Studio Top Team Fight - Docker Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Docker está rodando
Write-Host "Verificando se o Docker Desktop está rodando..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker Desktop está rodando!" -ForegroundColor Green
} catch {
    Write-Host "✗ ERRO: Docker Desktop não está rodando!" -ForegroundColor Red
    Write-Host "Por favor, inicie o Docker Desktop e tente novamente." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""

# Verificar se o arquivo .env existe no backend
Write-Host "Verificando se o arquivo .env existe no backend..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠ AVISO: Arquivo .env não encontrado no backend!" -ForegroundColor Yellow
    Write-Host "Criando arquivo .env com configurações padrão..." -ForegroundColor Yellow
    Write-Host ""
    
    $envContent = @"
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
"@
    
    $envContent | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "✓ Arquivo .env criado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANTE: Configure as variáveis de email no arquivo backend\.env" -ForegroundColor Red
    Write-Host "antes de continuar!" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
} else {
    Write-Host "✓ Arquivo .env já existe!" -ForegroundColor Green
}

Write-Host ""

# Parar containers existentes
Write-Host "Parando containers existentes (se houver)..." -ForegroundColor Yellow
docker-compose down | Out-Null

Write-Host ""
Write-Host "Construindo e iniciando os containers..." -ForegroundColor Yellow
Write-Host ""

# Executar docker-compose
docker-compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Aplicação iniciada com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:5175" -ForegroundColor White
Write-Host "Backend API: http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "Para parar os containers, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host "Para executar em background, use: docker-compose up -d --build" -ForegroundColor Yellow
Write-Host ""
Read-Host "Pressione Enter para sair" 