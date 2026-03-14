# Infrastructure Fixes & Optimization

This plan addresses the critical gaps and mismatches found in the current Docker Compose and Nginx setup.

## Proposed Changes

### [Component] Infrastructure (Docker & Nginx)

#### [MODIFY] [docker-compose.yml](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/infrastructure/docker-compose/docker-compose.yml)
- Add `redis` service (required by Laravel).
- Add `cadvisor` service (for container metrics).
- Add `k6` service (for load testing).
- Add volume mappings for Loki, Promtail, and Tempo config files.

#### [MODIFY] [default.conf](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/infrastructure/nginx/default.conf)
- Convert `proxy_pass` for `/api` and `/oauth` to `fastcgi_pass` targeting `backend:9000`.
- Implement proper FastCGI buffers and error handling.

#### [MODIFY] [backend/composer.json](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/backend/composer.json)
- Add `laravel/passport` dependency.
- Add `open-telemetry/*` (HTTP transport) dependencies.

#### [MODIFY] [backend/app/Models/User.php](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/backend/app/Models/User.php)
- Add `HasApiTokens` trait from Passport.

#### [NEW] [AuthServiceProvider.php](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/backend/app/Providers/AuthServiceProvider.php)
- Configure Passport routes and token lifetimes.

### [Component] Frontend (React)

#### [MODIFY] [frontend/package.json](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/frontend/package.json)
- Install `axios`, `react-router-dom`, `lucide-react`, `framer-motion`, `clsx`, `tailwind-merge`.
- Install OpenTelemetry web SDK packages.

#### [NEW] [api.js](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/frontend/src/services/api.js) [NEW]
- Axios instance with Bearer token interceptor and error handling.

#### [NEW] [Components & Pages]
- Layout wrapper with navigation.
- Login/Register pages.
- Product CRUD pages with validation.
- Sales transaction page.

#### [NEW] [otel.js](file:///d:/laragon/www/Saturday%20Session/Saturday%20Hackathon/frontend/src/services/otel.js) [NEW]
- OpenTelemetry initialization for the browser.

## Verification Plan

### Automated Tests
- Run `npm run lint` in frontend.
- Verify API connectivity via browser console.
- Check Grafana Tempo for frontend-originating traces.

### Manual Verification
- Perform a full flow: Register -> Login -> Create Product -> Record Sale.
- Verify stock decrement in the UI and DB.
