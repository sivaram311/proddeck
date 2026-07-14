# Deploy — ProdDeck

## Targets

| Env | Host (planned) | Port | Path hint |
|-----|----------------|------|-----------|
| DEV | local / sandbox | 3320 | `E:\MyWorkspace\sandbox\proddeck\` |
| PREPROD | per DNS map | 4320 | F: tree when promoted |
| PROD | `https://home.delena.buzz` | 5320 | `G:\apps\proddeck` (when cut over) |

## Build

```bash
npm ci
npm run build
npm start
```

Set `CSS_AUTH_URL` and `NEXT_PUBLIC_CSS_ISSUER` to the target CSS env **at build time** for client JWT issuer checks (`NEXT_PUBLIC_*`).

## CSS registration

- Register / seed clientId `proddeck` in CSS `RegisteredApplication`
- Redirect / CORS origins must include the ProdDeck public origin
- v1: any authenticated CSS user may open the deck

## Checklist

1. Port reserved in registry  
2. Env files set for target CSS  
3. `npm run build` green  
4. Smoke `GET /` → 200  
5. Login + catalog with Bearer  
6. DNS / reverse proxy to host when promoting  
