# 🎨 Tecda Maniquí - Cliente Dashboard (Frontend)

Este repositorio contiene la implementación de la **Interfaz de Usuario React + Vite (Frontend)** para el panel de gestión de producción e inventario de la fábrica de maniquíes **Tecda**.

Este proyecto forma parte de la currícula de la materia **Prácticas Profesionalizantes - TERCER AÑO**.

---

## 📂 Estructura de Carpetas y Estándares de Código

Este repositorio sigue una arquitectura de diseño modular y limpia basada en los estándares de **ECC (Everything Claude Code)**:

1. **Sin Archivos de Barril (`index.ts`):** Para evitar colisiones de nombres y cargas innecesarias en la compilación, se eliminaron los archivos `index.ts` intermediarios. Las importaciones se realizan directamente desde su origen utilizando el alias de ruta `@/` (por ejemplo: `import Button from '@/components/atoms/form/Button'`).
2. **Componentes Exportados de Forma Doble:** Todos los componentes se exportan como constantes nombradas (`export const Component = ...`) y también como valor por defecto (`export default Component`). Esto garantiza compatibilidad de importación y una indexación legible en TypeDoc sin nombres anónimos/`default`.
3. **Documentación JSDoc/TSDoc Completa:** Todos los componentes (átomos, moléculas, organismos, plantillas), controladores (hooks personalizados de features), contextos y servicios de API están documentados al 100% en español, detallando propósitos, parámetros, retornos y excepciones.

---

## 🚀 Guía de Inicio Rápido

### 1. Levantar el entorno de desarrollo local
Copia la plantilla preconfigurada para generar tu archivo `.env` (apunta a la API en el puerto `8082`):
```bash
cp .env.example .env
pnpm install
pnpm dev
```

### 2. Verificar y compilar el proyecto para producción
```bash
pnpm run build
```

---

## 🔑 Credenciales de Prueba para el Evaluador

El panel administrativo implementa control de acceso y vistas adaptativas según el rol del usuario (RBAC). Puedes iniciar sesión utilizando las siguientes cuentas de prueba precargadas:

| Rol / Nivel de Acceso | Usuario | Contraseña | Vistas y Funciones Permitidas |
| :--- | :--- | :--- | :--- |
| **Gerente de Producción** | `gerente` | `gerente` | Acceso completo a producción, registro de modelos y reportes financieros. |
| **Vendedor** | `vendedor` | `vendedor` | Acceso a registro de ventas y visualización de stock/catálogos. |
| **Operario** | `operario` | `operario` | Panel básico de control de calidad y estados de piezas. |
| **Administrador General** | `admin_pablo` | `tecda2026` | Permisos totales de gestión sobre la plataforma. |

---

## 📖 Centro de Documentación y Referencia Técnica

Toda la documentación visual y la referencia técnica autogenerada está disponible en las siguientes rutas:

*   **Referencia Técnica Interactiva (TypeDoc):**
    Genera y abre la documentación detallada de la arquitectura de componentes y hooks:
    ```bash
    pnpm run docs
    ```
    Una vez generada, puedes abrir [docs/technical-reference/index.html](docs/technical-reference/index.html) en tu navegador.
*   **Guías Visuales Internas:**
    *   👉 **[Manual de Operaciones y Roles](docs/ROLES_Y_OPERACIONES.md)**: Detalle del sistema RBAC en la interfaz.
    *   👉 **[Guía de Componentes y Vistas](docs/components.md)** *(Próximamente)*
    *   👉 **[Diseño Visual Obsidian Glassmorphism](docs/styles.md)** *(Próximamente)*

---
*Desarrollado de forma modular e independiente bajo la organización @tecda-maniqui-factory.*
