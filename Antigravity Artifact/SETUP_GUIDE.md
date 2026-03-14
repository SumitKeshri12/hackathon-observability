# Hackathon 2.0 | Deployment & Setup Guide

This guide provides step-by-step instructions to get the full stack (Laravel, React, Observability) running on a new machine.

## 📋 Prerequisites

Ensure the following are installed on the new PC:
1.  **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/) (Include Docker Compose).
2.  **Git**: Optional, but recommended.
3.  **Terminal**: PowerShell, Bash, or CMD.

---

## 🚀 Installation Steps

### 1. Extract the Project
Extract the `Saturday Hackathon.zip` file. Your folder structure should look like this:
```text
Saturday Hackathon/
├── backend/
├── frontend/
└── infrastructure/
    ├── docker-compose/
    ├── grafana/
    ├── prometheus/
    └── ...
```

### 2. Configure Environment
Navigate to the `backend` directory and ensure the [.env](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/backend/.env) file exists.
> [!IMPORTANT]
> The [.env](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/backend/.env) file provided in this zip is already configured for Docker. Do **not** change the `DB_HOST=postgres` or `REDIS_HOST=redis` values.

### 3. Build & Orchestrate (Docker)
Open your terminal in the **`infrastructure/docker-compose`** directory and run:

```powershell
# Build and start all containers in the background
docker-compose up -d --build
```

### 4. Initialize the Database & Auth
Once the containers are up, you must run the migrations and generate the encryption keys for Passport. Run these commands from the same directory:

```powershell
# Run migrations
docker-compose exec backend php artisan migrate --force

# Install Passport keys & clients
docker-compose exec backend php artisan passport:install --no-interaction
```

---

## 🔍 Accessing the Services

| Service | URL | Credentials |
| :--- | :--- | :--- |
| **Frontend App** | [http://localhost](http://localhost) | Register a new account |
| **Grafana** | [http://localhost:3001](http://localhost:3001) | `admin` / `admin` |
| **Prometheus** | [http://localhost:9090](http://localhost:9090) | - |

---

## 🛠️ Verification & Testing

### 1. Run a Load Test
To see the observability stack (Tempo, Loki) in action, run the k6 load test:
```powershell
docker-compose run --rm k6 run /scripts/basic_load_test.js
```

### 2. Inject an Anomaly
Log into the app, then visit `http://localhost/api/anomaly`. This will trigger a 3-second backend delay visible in your **Observability Deep Dive** dashboard.

### 3. Check Logs
If something isn't working, check the backend logs:
```powershell
docker-compose logs -f backend
```

---

## 💡 Troubleshooting
*   **Port Conflicts**: If port 80 or 3001 is already in use, modify the `ports` section in `infrastructure/docker-compose/docker-compose.yml`.
*   **Vite Boilerplate**: If the frontend shows the default Vite page, run `docker-compose restart frontend`.
