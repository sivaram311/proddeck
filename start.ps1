param(
    [ValidateSet("dev", "preprod", "prod")]
    [string]$EnvName = "preprod"
)

$ErrorActionPreference = "Stop"
$appDirectory = Join-Path $PSScriptRoot "app"

# css-next IdP (v0.2.0) — classic :5900 left for other apps
if ($EnvName -eq "prod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5910"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css-next.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "hybrid"
    $env:NEXT_PUBLIC_APP_URL = "https://home.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:5080/api/platform/apps"
    $env:OS_EVENTS_FORWARD = "1"
    $env:PORT = "5320"
} elseif ($EnvName -eq "preprod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5910"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css-next.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "hybrid"
    $env:NEXT_PUBLIC_APP_URL = "https://home-staging.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:4080/api/platform/apps"
    $env:OS_EVENTS_FORWARD = "1"
    $env:PORT = "4320"
} else {
    $env:CSS_AUTH_URL = "https://css-next.delena.buzz"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css-next.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "hybrid"
    $env:NEXT_PUBLIC_APP_URL = "https://home-dev.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:8080/api/platform/apps"
    $env:OS_EVENTS_FORWARD = "1"
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
