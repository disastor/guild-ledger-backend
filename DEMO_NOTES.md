# Demo Notes — Seeded Issues (Backend Component)

This app was deliberately built the way a rushed, "vibe coded" internal tool gets
built — someone paired with an AI, shipped fast, and skipped review. Nothing here is
a real credential or a working exploit; it's all fake/demo data. Use this as the
answer key when walking through what the Policy Engine / scanning step catches.

| # | Issue | Where | Why it matters |
|---|-------|-------|-----------------|
| 1 | Hardcoded secrets committed to the repo | `.env`, `server.js` (fallback constants) | Classic secret-sprawl: API key and JWT secret sitting in plaintext in version control. Secret scanning should flag both the file and the hardcoded fallback in code. |
| 2 | SQL injection | `routes/characters.js` → `GET /search` | Query built with string concatenation instead of a parameterized query (`$1`). Directly exploitable via the `name` query param. |
| 3 | Overly permissive CORS | `server.js` | `origin: "*"` combined with `credentials: true` — allows any origin to make credentialed requests. |
| 4 | Plaintext credential comparison | `routes/auth.js` | Admin password compared directly (`===`), no hashing, no rate limiting/lockout, weak default password (`letmein`) shipped as a fallback. |
| 5 | Outdated / vulnerable dependencies | `package.json` | `express@4.16.0`, `lodash@4.17.4`, `body-parser@1.18.3` are old versions with known published CVEs. |
| 6 | Sensitive data in logs | `server.js` startup logs | API key and JWT secret are printed to stdout on boot — ends up in container/CI logs. |
| 7 | No input validation on write endpoints | `routes/characters.js`, `routes/matches.js` | `POST` handlers trust `req.body` directly — no length limits, type checks, or sanitization. |
| 8 | Weak default DB credentials | `.env`, `docker-compose.yml` | `postgres` / `postgres`, fine for local dev, exactly the kind of thing that gets copy-pasted into a real environment. |

## Suggested demo flow

1. Show this repo on GitHub as-is — point out `.env` is tracked (`git log` shows it
   was never gitignored).
2. Run the CloudBees Unify workflow with the Policy Engine step wired in against
   this component.
3. Watch it flag items 1, 2, 3, and 5 automatically (secrets, SQLi pattern, CORS
   config, dependency CVEs).
4. Talk through 4, 6, 7, 8 as the kind of thing a custom policy/rule could add on top
   of the out-of-the-box checks.
5. Fix one issue live (e.g., swap the SQL string-concat query for the parameterized
   version already used elsewhere in the same file) and re-run to show the gate
   turning green.
