# Cutover / Rollback — ProdDeck only

**Applies:** Q1 `F:\apps\proddeck` `:4320` · Q2 `G:\apps\proddeck` `:5320`  
**Never:** stop `4310/4311/5310/5311/5080` or CSS for this playbook.

## Pre-cutover

1. Prior release intact under `H:\releases\proddeck-*`  
2. Evidence pack + EM GO  
3. `promote-field-ops` checklist reviewed (`field-lessons.md`)  
4. Confirm listening PID on target port is ProdDeck only  

## Cutover (Q1 example)

1. Record current PID on `:4320`  
2. Stop **that PID only** (never assign `$PID` / `$HOME` as locals)  
3. Deploy new bits to `F:\apps\proddeck`  
4. Start via app `start.ps1`  
5. Poll `LISTENING` on `4320` for 30–60s (ignore early false “Failed to bind”)  
6. Smoke `http://127.0.0.1:4320` + `https://home-staging.delena.buzz`  
7. Catalog 401/junk matrix + helpdesk 401  
8. Read-only non-regression: agentverse-staging + agentverse-v2-staging still up  

## Rollback

1. Stop ProdDeck PID on target port only  
2. Restore previous H: release into `F:\apps\proddeck` (or G:)  
3. Start + poll LISTENING  
4. Public HTTPS smoke  
5. Log ACTIVITY-LOG + evidence note  

## Maintenance window

Expect short blank on `home-staging` during Q1 replace. No other hostnames should change.
