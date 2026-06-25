# Shopsphere Build and Bundle Script
# This script builds the React frontend and packages it inside the Spring Boot backend JAR.

Write-Host "==============================================" -ForegroundColor Green
Write-Host "Starting Shopsphere Deployment Prep..." -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# 1. Build the Frontend
Write-Host "`n[1/3] Building React Frontend..." -ForegroundColor Yellow
Push-Location frontend
npm install
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed!"
    Pop-Location
    Exit 1
}
Pop-Location

# 2. Sync Static Resources
Write-Host "`n[2/3] Copying Frontend Assets to Spring Boot Static Folder..." -ForegroundColor Yellow
$StaticDir = "backend\src\main\resources\static"

if (Test-Path $StaticDir) {
    Remove-Item -Recurse -Force "$StaticDir\*"
} else {
    New-Item -ItemType Directory -Path $StaticDir -Force
}

Copy-Item -Path "frontend\dist\*" -Destination $StaticDir -Recurse -Force
Write-Host "Assets copied successfully." -ForegroundColor Green

# 3. Package the Backend
Write-Host "`n[3/3] Packaging Spring Boot JAR..." -ForegroundColor Yellow
Push-Location backend
mvn package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend packaging failed!"
    Pop-Location
    Exit 1
}
Pop-Location

Write-Host "`n==============================================" -ForegroundColor Green
Write-Host "SUCCESS: Unified runnable JAR generated at:" -ForegroundColor Green
Write-Host "backend\target\shopsphere-0.0.1-SNAPSHOT.jar" -ForegroundColor White
Write-Host "==============================================" -ForegroundColor Green
