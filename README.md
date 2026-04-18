# Note Handling App

An application to submit your oncall handover notes.

## Running locally

Copy the API env file first:

```bash
cp ./api/env_example ./api/.env
```

```bash
docker compose up
```

- Web UI: http://localhost:3000
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

## What is this

A simple web app with:
- **API** (Typescript / Express) on port 8000
- **Web** (React / Vite) on port 3000

