# Keeps Expo web dev server reachable for auto-preview (port 8086).
$ErrorActionPreference = 'SilentlyContinue'
$port = 8086
$root = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent

function Test-PortListening([int]$p) {
  try {
    $r = Invoke-WebRequest -Uri "http://localhost:$p" -UseBasicParsing -TimeoutSec 2
    return $r.StatusCode -ge 200
  } catch {
    return $false
  }
}

if (Test-PortListening $port) {
  exit 0
}

$logDir = Join-Path $env:TEMP 'mactan-matzip-preview'
New-Item -ItemType Directory -Force -Path $logDir | Out-Null
$logFile = Join-Path $logDir "expo-web-$port.log"

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = 'npx'
$psi.Arguments = "expo start --web --port $port"
$psi.WorkingDirectory = $root
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
# CI=1 은 HMR(자동 새로고침)을 끄므로 로컬 미리보기에서는 사용하지 않음
Remove-Item Env:CI -ErrorAction SilentlyContinue
[System.Diagnostics.Process]::Start($psi) | Out-Null

Start-Sleep -Seconds 3
exit 0
