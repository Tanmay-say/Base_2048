# Icon resizing script using .NET System.Drawing
Add-Type -AssemblyName System.Drawing

$sourceIcon = "icon-512x512.png"
$sizes = @(72, 96, 128, 144, 384)

if (-not (Test-Path $sourceIcon)) {
    Write-Host "Error: $sourceIcon not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Loading source image: $sourceIcon" -ForegroundColor Cyan
$sourceImage = [System.Drawing.Image]::FromFile((Resolve-Path $sourceIcon))

foreach ($size in $sizes) {
    $outputFile = "icon-${size}x${size}.png"
    
    Write-Host "Creating $outputFile..." -ForegroundColor Yellow
    
    $newImage = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($newImage)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    $newImage.Save($outputFile, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $newImage.Dispose()
    
    Write-Host "Created $outputFile" -ForegroundColor Green
}

$sourceImage.Dispose()
Write-Host "All icons created successfully!" -ForegroundColor Green
