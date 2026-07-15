param(
    [ValidateSet("dev", "preprod", "prod")]
    [string]$EnvName = "preprod"
)

$ErrorActionPreference = "Stop"
$appDirectory = Join-Path $PSScriptRoot "app"

# Classic CSS IdP (v0.1.0) — Postgres app_css.prod / preprod / dev schemas
if ($EnvName -eq "prod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5900"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "password"
    $env:NEXT_PUBLIC_APP_URL = "https://home.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:5080/api/platform/apps"
    $env:OS_EVENTS_FORWARD = "1"
    $env:PORT = "5320"
} elseif ($EnvName -eq "preprod") {
    $env:CSS_AUTH_URL = "http://127.0.0.1:5900"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "password"
    $env:NEXT_PUBLIC_APP_URL = "https://home-staging.delena.buzz"
    $env:PLATFORM_APPS_URL = "http://127.0.0.1:4080/api/platform/apps"
    $env:OS_EVENTS_FORWARD = "1"
    $env:PORT = "4320"
} else {
    # DEV: same stable classic IdP (Postgres) unless CSS DEV :9000 is up
    $env:CSS_AUTH_URL = "http://127.0.0.1:5900"
    $env:NEXT_PUBLIC_CSS_ISSUER = "https://css.delena.buzz"
    $env:NEXT_PUBLIC_CSS_AUTH_MODE = "password"
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
