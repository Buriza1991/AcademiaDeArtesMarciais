@echo off
echo ========================================
echo Studio Top Team Fight - Docker Setup
echo ========================================
echo.

echo Verificando se o Docker Desktop esta rodando...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker Desktop nao esta rodando!
    echo Por favor, inicie o Docker Desktop e tente novamente.
    pause
    exit /b 1
)

echo Docker Desktop esta rodando!
echo.

echo Verificando se o arquivo .env existe no backend...
if not exist "backend\.env" (
    echo AVISO: Arquivo .env nao encontrado no backend!
    echo Criando arquivo .env com configuracoes padrao...
    echo.
    echo NODE_ENV=development > backend\.env
    echo PORT=3001 >> backend\.env
    echo DATABASE_URL=file:./dev.db >> backend\.env
    echo JWT_SECRET=your-super-secret-jwt-key-change-in-production >> backend\.env
    echo JWT_EXPIRES_IN=7d >> backend\.env
    echo EMAIL_HOST=smtp.gmail.com >> backend\.env
    echo EMAIL_PORT=587 >> backend\.env
    echo EMAIL_USER=your-email@gmail.com >> backend\.env
    echo EMAIL_PASS=your-app-password >> backend\.env
    echo BCRYPT_ROUNDS=12 >> backend\.env
    echo RATE_LIMIT_WINDOW_MS=900000 >> backend\.env
    echo RATE_LIMIT_MAX_REQUESTS=100 >> backend\.env
    echo FRONTEND_URL=http://localhost:5175 >> backend\.env
    echo API_BASE_URL=http://localhost:3001/api >> backend\.env
    echo.
    echo IMPORTANTE: Configure as variaveis de email no arquivo backend\.env
    echo antes de continuar!
    echo.
    pause
)

echo Parando containers existentes (se houver)...
docker-compose down

echo.
echo Construindo e iniciando os containers...
docker-compose up --build

echo.
echo ========================================
echo Aplicacao iniciada com sucesso!
echo ========================================
echo.
echo Frontend: http://localhost:5175
echo Backend API: http://localhost:3001/api
echo.
echo Para parar os containers, pressione Ctrl+C
echo Para executar em background, use: docker-compose up -d --build
echo.
pause 