# Start the backend using the workspace virtualenv
# Run this from the backend folder or double-click in Explorer.

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptRoot "..")
$venvPython = Join-Path $projectRoot ".venv\Scripts\python.exe"
$venvPython = Resolve-Path $venvPython -ErrorAction Stop
Push-Location $projectRoot
try {
    & $venvPython -m uvicorn backend.app.main:app --reload
} finally {
    Pop-Location
}
