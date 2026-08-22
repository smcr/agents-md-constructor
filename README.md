# AGENTS.md constructor

Конструктор файла AGENTS.md: справочники Section / Rule / Tag и сборка превью из выбранных правил.

## Local development

```bash
make up
make migrate
```

- UI: http://localhost:5173
- API: http://localhost:3000/api/health

After changing code, if the UI looks stale or throws in the console:

```bash
make restart
```

Then hard-refresh the browser (Ctrl+Shift+R). `make restart-frontend` restarts only Vite; `make restart-backend` only the API.

All targets: `make help`. Logs: `make logs`. Stop: `make down`.

## Production image

Frontend and backend are packed into one image:

```bash
make build
```

Run against an external PostgreSQL:

```bash
docker run --rm -p 8080:8080 \
  -e DATABASE_URL=postgresql://agents:agents@host.docker.internal:5432/agents \
  agents-md-creator:latest
```

Kubernetes manifests are in `k8s/`. Create the `agents-md-creator` secret with `DATABASE_URL` (see `k8s/secret.example.yaml`), then apply Deployment and Service.
