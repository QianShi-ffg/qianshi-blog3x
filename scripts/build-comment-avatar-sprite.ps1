param(
  [string]$SourceDir = 'C:\Users\12286\Desktop\cat',
  [string]$OutputPath = 'public\images\comment-cat-avatars.png',
  [int]$FrameSize = 150,
  [int]$GridColumns = 5,
  [int]$GridRows = 5
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$resolvedSourceDir = Resolve-Path -LiteralPath $SourceDir
$resolvedOutputPath = Join-Path (Get-Location) $OutputPath
$outputDir = Split-Path -Parent $resolvedOutputPath

if (-not (Test-Path -LiteralPath $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$files = Get-ChildItem -LiteralPath $resolvedSourceDir -File |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } |
  Sort-Object Name

if ($files.Count -eq 0) {
  throw "No supported images found in $resolvedSourceDir"
}

$frameCount = $files.Count * $GridColumns * $GridRows
$sprite = New-Object System.Drawing.Bitmap($FrameSize, ($FrameSize * $frameCount))
$graphics = [System.Drawing.Graphics]::FromImage($sprite)

try {
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

  $frameIndex = 0

  foreach ($file in $files) {
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    try {
      for ($row = 0; $row -lt $GridRows; $row++) {
        for ($column = 0; $column -lt $GridColumns; $column++) {
          $cropX = [Math]::Round($column * $image.Width / $GridColumns)
          $cropY = [Math]::Round($row * $image.Height / $GridRows)
          $nextX = [Math]::Round(($column + 1) * $image.Width / $GridColumns)
          $nextY = [Math]::Round(($row + 1) * $image.Height / $GridRows)
          $sourceRect = New-Object System.Drawing.Rectangle($cropX, $cropY, ($nextX - $cropX), ($nextY - $cropY))
          $targetRect = New-Object System.Drawing.Rectangle(0, ($frameIndex * $FrameSize), $FrameSize, $FrameSize)

          $graphics.DrawImage($image, $targetRect, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
          $frameIndex++
        }
      }
    }
    finally {
      $image.Dispose()
    }
  }

  $sprite.Save($resolvedOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
}
finally {
  $graphics.Dispose()
  $sprite.Dispose()
}

Write-Output "Generated $frameCount frames at $resolvedOutputPath"
