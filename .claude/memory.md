# Project Memory & Decisions

This file tracks important context and decisions for the Tecda Maniquí Frontend project.

---

## 📝 Decisions & Resolutions

### 1. Database Part Codes Alignment
* **Date:** 2026-06-16
* **Context:** The frontend was using old part codes (`BRI`, `BRD`, `PII`, `PID`) inside `SupplyPage.tsx` and `useSupplyController.ts` which caused database/backend validation error `Tipo de pieza no encontrado`.
* **Decision:** Replace them with standard database part codes (`BRA-I`, `BRA-D`, `PIE-I`, `PIE-D`) in the select dropdown options and SSE event mapping (`partMap`).

### 2. Dockerization with Nginx fallback
* **Date:** 2026-06-16
* **Context:** The project was missing a Dockerfile.
* **Decision:** Create a multi-stage Dockerfile compiling the app using Node/pnpm and serving it using Nginx. An `nginx.conf` was added to rewrite routes to `index.html` to prevent 404 errors during client-side React Router navigation.

### 3. Build Scripts Ignored
* **Date:** 2026-06-16
* **Context:** pnpm v11 throws errors during docker builds if build scripts are ignored by default.
* **Decision:** Add `--ignore-scripts` to all `pnpm install` commands in the Dockerfile.
