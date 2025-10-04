# NASA Space Biology AI - Docker Setup

## Configuración Docker

Este proyecto está dockerizado con 2 contenedores principales:
- **Backend**: FastAPI API (puerto 8000)
- **AI Service**: Módulo de procesamiento de IA
- **Frontend**: React (no dockerizado por ahora)

## Requisitos

- Docker Desktop instalado y ejecutándose
- Archivo `.env` configurado con tu API key de OpenAI

## Comandos Docker (CMD/PowerShell)

### 1. Construir y ejecutar todos los servicios
```cmd
docker-compose up --build -d
```

### 2. Ver logs de todos los servicios
```cmd
docker-compose logs -f
```

### 3. Ver logs de un servicio específico
```cmd
docker-compose logs -f backend
docker-compose logs -f ai-service
```

### 4. Ver estado de los servicios
```cmd
docker-compose ps
```

### 5. Parar todos los servicios
```cmd
docker-compose down
```

### 6. Reiniciar todos los servicios
```cmd
docker-compose down
docker-compose up -d
```

### 7. Acceder al shell del backend
```cmd
docker-compose exec backend bash
```

### 8. Acceder al shell del AI service
```cmd
docker-compose exec ai-service bash
```

### 9. Ejecutar comandos de IA
```cmd
# Procesar artículos
docker-compose exec ai-service python main.py process --limit 10

# Analizar artículos
docker-compose exec ai-service python main.py analyze

# Chat interactivo
docker-compose exec ai-service python main.py chat

# Recomendar artículos
docker-compose exec ai-service python main.py recommend --query "microgravity effects"
```

### 10. Limpiar recursos Docker
```cmd
# Parar y eliminar contenedores
docker-compose down -v

# Eliminar imágenes
docker-compose down --rmi all

# Limpiar sistema Docker
docker system prune -f
```

## URLs de Acceso

Una vez ejecutando los contenedores:

- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Status API**: http://localhost:8000/api/v1/research/status

## Variables de Entorno

El archivo `.env` debe contener al menos:
```env
OPENAI_API_KEY=tu_api_key_aqui
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=4000
OPENAI_TEMPERATURE=0.1
```

## Solución de Problemas

### Error de conexión a OpenAI
- Verifica que `OPENAI_API_KEY` esté configurado en `.env`
- Verifica que la API key sea válida

### Error de puertos ocupados
- Verifica que el puerto 8000 no esté siendo usado por otra aplicación
- Cambia el puerto en `docker-compose.yml` si es necesario

### Error de permisos en Windows
- Ejecuta PowerShell como administrador
- Verifica que Docker Desktop esté ejecutándose

### Reconstruir contenedores
```cmd
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Estructura de Archivos

```
├── backend/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── ai/
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
│   └── ...
├── docker-compose.yml
├── .dockerignore
├── .env
└── DOCKER.md
```
