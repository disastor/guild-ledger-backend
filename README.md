# Guild Ledger — API

Express + Postgres API for the Guild Ledger character/win-loss tracker.

> Built as a demo target for the CloudBees Policy Engine — see `DEMO_NOTES.md` for the
> issues intentionally seeded in this codebase.

## Run locally

```bash
docker compose up --build
```

- API: http://localhost:4000 (health check at `/api/health`)
- Postgres: localhost:5432 (`postgres` / `postgres`, db `guildledger`)

Seeded with a few sample characters and matches on first boot (`db/init.sql`).

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/characters` | List all characters |
| GET | `/api/characters/search?name=` | Search by name |
| GET | `/api/characters/:id` | Get one character |
| POST | `/api/characters` | Create a character |
| DELETE | `/api/characters/:id` | Delete a character |
| GET | `/api/matches/character/:id` | List a character's match history |
| POST | `/api/matches` | Log a match result |
| POST | `/api/auth/login` | Admin login (returns a JWT) |

## Companion repo

The frontend lives in a separate repo: `guild-ledger-frontend`. Set its
`VITE_API_URL` to point at wherever this API ends up running.

## Deploying

This is a stateful Express + Postgres app — it needs a host that runs
long-lived Node processes (Railway, Render, Fly.io, a CloudBees-managed
target, etc). It will not run as a Netlify Function without a rewrite.
