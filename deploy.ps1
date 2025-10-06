# NASA Space Biology AI - Unified Google Cloud Deployment Script (PowerShell)

param(
    [string]$ProjectId = "bionabu",
    [string]$Region = "us-central1"
)

Write-Host "🚀 Deploying NASA Space Biology AI to Google Cloud..." -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Host "❌ gcloud CLI not found. Please install it first." -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "📋 Setting project..." -ForegroundColor Blue
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "🔧 Enabling required APIs..." -ForegroundColor Blue
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firebase.googleapis.com

# Authenticate
Write-Host "🔐 Authenticating..." -ForegroundColor Blue
gcloud auth configure-docker

# Create Cloud Storage bucket for data
Write-Host "📦 Creating Cloud Storage bucket..." -ForegroundColor Blue
$DataBucketName = "bionabu-data-$ProjectId"

gsutil mb gs://$DataBucketName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Data bucket already exists" -ForegroundColor Yellow
}

# Check Firebase configuration
Write-Host "🔥 Checking Firebase Hosting..." -ForegroundColor Blue
if (Test-Path "frontend/firebase.json") {
    Write-Host "✅ Firebase configuration found" -ForegroundColor Green
} else {
    Write-Host "⚠️ Firebase not configured. Please enable Firebase Hosting in console:" -ForegroundColor Yellow
    Write-Host "https://console.firebase.google.com/project/$ProjectId/hosting" -ForegroundColor White
}

# Upload initial data
Write-Host "📤 Uploading initial data..." -ForegroundColor Blue
if (Test-Path "ai/data") {
    gsutil -m cp -r ai/data/* gs://$DataBucketName/data/
}

# Load environment variables from .env file
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^#=]+)=(.+)$") {
            $key = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            Set-Item -Path Env:$key -Value $value
        }
    }
} else {
    Write-Host "Error: .env file not found. Please create one with your API keys." -ForegroundColor Red
    exit 1
}

# Get API Keys from environment
$OpenAiApiKey = $env:OPENAI_API_KEY
$GeminiApiKey = $env:GEMINI_API_KEY
$FirebaseToken = $env:FIREBASE_TOKEN

if (-not $OpenAiApiKey) {
    Write-Host "Error: OPENAI_API_KEY not found in .env file or environment variables." -ForegroundColor Red
    exit 1
}

if (-not $GeminiApiKey) {
    Write-Host "Error: GEMINI_API_KEY not found in .env file or environment variables." -ForegroundColor Red
    exit 1
}

if (-not $FirebaseToken) {
    Write-Host "Error: FIREBASE_TOKEN environment variable is required for deployment." -ForegroundColor Red
    Write-Host "Please set FIREBASE_TOKEN environment variable or add it to your .env file." -ForegroundColor Yellow
    exit 1
}

# Build and deploy with Cloud Build (unified deployment)
Write-Host "🏗️ Building and deploying with Cloud Build..." -ForegroundColor Blue
gcloud builds submit --config cloudbuild.yaml --substitutions=_OPENAI_API_KEY=$OpenAiApiKey,_GEMINI_API_KEY=$GeminiApiKey,_FIREBASE_TOKEN=$FirebaseToken

# Get Cloud Run URLs
Write-Host "🌐 Getting service URLs..." -ForegroundColor Blue
try {
    $AiBackendUrl = gcloud run services describe bionabu-ai-backend --region=$Region --format="value(status.url)"
    $DataBackendUrl = gcloud run services describe bionabu-data-backend --region=$Region --format="value(status.url)"
} catch {
    Write-Host "⚠️ Services not found yet. They may still be deploying." -ForegroundColor Yellow
    $AiBackendUrl = "https://bionabu-ai-backend-$ProjectId-$Region.a.run.app"
    $DataBackendUrl = "https://bionabu-data-backend-$ProjectId-$Region.a.run.app"
}

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Service URLs:" -ForegroundColor Cyan
Write-Host "AI Backend API: $AiBackendUrl" -ForegroundColor White
Write-Host "Data Backend API: $DataBackendUrl" -ForegroundColor White
Write-Host "Frontend: https://$ProjectId.web.app" -ForegroundColor White
Write-Host "Frontend: https://$ProjectId.firebaseapp.com" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "1. Test AI Backend API: $AiBackendUrl/health"
Write-Host "2. Test Data Backend API: $DataBackendUrl/getAll"
Write-Host "3. Test Frontend: https://$ProjectId.web.app"
Write-Host "4. Configure custom domain (optional)"
Write-Host "5. Set up monitoring and logging"
Write-Host ""
Write-Host "🔧 To update environment variables:" -ForegroundColor Yellow
Write-Host "gcloud run services update bionabu-ai-backend --region=$Region --set-env-vars='OPENAI_API_KEY=your_new_key_here'"
Write-Host "gcloud run services update bionabu-data-backend --region=$Region --set-env-vars='GEMINI_API_KEY=your_new_key_here'"