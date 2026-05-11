param(
  [switch]$Install
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Resolve-Python {
  $venvPy = Join-Path $root ".venv\Scripts\python.exe"
  if (Test-Path $venvPy) { return $venvPy }
  return "python"
}

function Start-ServiceTerminal {
  param(
    [string]$Name,
    [string]$WorkingDir,
    [string]$Command
  )

  $cmd = "`$host.ui.RawUI.WindowTitle = '$Name'; Set-Location -Path '$WorkingDir'; $Command"
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $cmd
}

$python = Resolve-Python

if ($Install) {
  if (-not (Test-Path (Join-Path $root "backend\node_modules"))) {
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$root\backend'; npm install" -Wait
  }
  if (-not (Test-Path (Join-Path $root "frontend\node_modules"))) {
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$root\frontend'; npm install" -Wait
  }
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$root\ml'; & '$python' -m pip install -r requirements.txt" -Wait
}

Start-ServiceTerminal -Name "VAULTO ML" -WorkingDir (Join-Path $root "ml") -Command "& '$python' app.py"
Start-ServiceTerminal -Name "VAULTO Backend" -WorkingDir (Join-Path $root "backend") -Command "npm start"
Start-ServiceTerminal -Name "VAULTO Frontend" -WorkingDir (Join-Path $root "frontend") -Command "npm run dev"

Write-Host "All services started."
Write-Host "ML:      http://localhost:5000"
Write-Host "Backend: http://localhost:4000"
Write-Host "Frontend: http://localhost:5173"
