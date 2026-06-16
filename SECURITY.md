# Security Policy

This document outlines the security posture, vulnerability reporting process, and security practices of the Tecda Maniquí Frontend service.

## 🔒 Security Practices

1. **Authentication State:** JWT tokens are stored securely in memory or transient storage. Session expirations are managed by checking token validity on routing and API calls.
2. **Environment Variables:** API URL configurations are loaded at build time via `.env` files (e.g. `VITE_API_URL`).
3. **No Secret Storage:** Secrets must never be loaded or stored on the client side. Any API keys or critical operations must be delegated to the backend.

## 🛡️ Vulnerability Reporting

If you find a security vulnerability, please report it immediately:
1. Do not open a public issue.
2. Email your findings and reproduction steps to the development lead.
3. A patch will be prepared and deployed before disclosure.
