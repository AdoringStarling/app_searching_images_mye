# Script para copiar todas las imágenes del proyecto SIAVRA-MME
# Este script copia todas las imágenes desde Analisis_territorial a la carpeta public/images

param(
    [string]$SourcePath = "D:\app-img-01\Analisis_territorial",
    [string]$DestPath = "D:\app-img-01\app\public\images"
)

Write-Host "Iniciando copia de imágenes SIAVRA-MME..." -ForegroundColor Green
Write-Host "Origen: $SourcePath" -ForegroundColor Yellow
Write-Host "Destino: $DestPath" -ForegroundColor Yellow

# Crear directorio de destino si no existe
if (!(Test-Path $DestPath)) {
    New-Item -ItemType Directory -Path $DestPath -Force
    Write-Host "Directorio creado: $DestPath" -ForegroundColor Cyan
}

# Contador de archivos
$contadorTotal = 0
$contadorCopiados = 0

# Buscar todas las imágenes JPG, JPEG y PNG
$extensiones = @("*.jpg", "*.jpeg", "*.png")
$todasLasImagenes = @()

foreach ($ext in $extensiones) {
    $imagenes = Get-ChildItem -Path $SourcePath -Filter $ext -Recurse
    $todasLasImagenes += $imagenes
}

$contadorTotal = $todasLasImagenes.Count
Write-Host "Total de imágenes encontradas: $contadorTotal" -ForegroundColor Magenta

# Copiar cada imagen
foreach ($imagen in $todasLasImagenes) {
    try {
        # Usar solo el nombre del archivo para evitar conflictos
        $nombreDestino = $imagen.Name
        $rutaDestino = Join-Path $DestPath $nombreDestino
        
        # Verificar si ya existe y es más nueva
        if (Test-Path $rutaDestino) {
            $fechaOrigen = (Get-Item $imagen.FullName).LastWriteTime
            $fechaDestino = (Get-Item $rutaDestino).LastWriteTime
            
            if ($fechaOrigen -le $fechaDestino) {
                continue # Saltar si el archivo destino es igual o más nuevo
            }
        }
        
        Copy-Item -Path $imagen.FullName -Destination $rutaDestino -Force
        $contadorCopiados++
        
        if ($contadorCopiados % 50 -eq 0) {
            Write-Host "Progreso: $contadorCopiados / $contadorTotal imágenes copiadas..." -ForegroundColor Blue
        }
    }
    catch {
        Write-Warning "Error copiando $($imagen.Name): $($_.Exception.Message)"
    }
}

Write-Host "¡Copia completa!" -ForegroundColor Green
Write-Host "Total copiadas: $contadorCopiados de $contadorTotal imágenes" -ForegroundColor Green
Write-Host "Ubicación: $DestPath" -ForegroundColor Yellow

# Verificar el tamaño total
$tamanoTotal = (Get-ChildItem $DestPath | Measure-Object -Property Length -Sum).Sum
$tamanoMB = [math]::Round($tamanoTotal / 1MB, 2)
Write-Host "Tamaño total de imágenes: $tamanoMB MB" -ForegroundColor Cyan