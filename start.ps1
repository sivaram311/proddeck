param(
    [ValidateSet("dev", "preprod", "prod")]
    [string]$EnvName = "preprod"
)

$ErrorActionPreference = "Stop"
$appDirectory = Join-Path $PSScriptRoot "app"

if ($EnvName -eq "prod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5900"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:5080/api/platform/apps"
    $env:PORT = "5320"
} elseif ($EnvName -eq "preprod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5900"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:4080/api/platform/apps"
    $env:PORT = "4320"
} else {
    $env:CSS_AUTH_URL = "http://127.0.0.1:9000"
    $env:NEXT_PUBLIC_CSS_ISSUER = "http://localhost:9000"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:8080/api/platform/apps"
    $env:PORT = "3320"
}

if (-not (Test-Path (Join-Path $appDirectory "package.json"))) {
    throw "ProdDeck app package was not found at $appDirectory"
}

Push-Location $appDirectory
try {
    & npx next start -H 0.0.0.0 -p $env:PORT
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
