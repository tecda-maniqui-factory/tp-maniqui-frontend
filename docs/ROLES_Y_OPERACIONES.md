# Manual de Operaciones y Roles - Tecda Maniquí

Este documento define la estructura de permisos y responsabilidades operativas dentro de la plataforma Tecda Maniquí (Frontend + Backend). El sistema utiliza **RBAC (Role-Based Access Control)** para delimitar las áreas de trabajo.

## 1. Perfiles de Usuario

El sistema reconoce principalmente tres perfiles operativos, configurados a nivel de base de datos en la tabla `Usuarios`.

### 🏭 Gerente de Producción (`gerente_prod`)
**Propósito:** Administrador técnico de la planta y responsable del catálogo y suministro.
*   **Diseñar Modelos (`/modelos`):** Único rol con acceso a la **Botonera Técnica**. Define las "recetas" (qué piezas anatómicas componen un modelo).
*   **Suministros (`/suministros`):** Registra el ingreso de piezas sueltas (cabezas, brazos, etc.) provenientes de proveedores externos o de la planta principal para reabastecer el inventario.
*   **Reportes (`/reportes`):** Acceso a métricas financieras, cálculo de rentabilidad por modelo y ganancias acumuladas.
*   **Producción y Dashboard:** Acceso total para supervisión de alertas de stock crítico y control de la línea de ensamblaje.

### ⚙️ Operario de Línea (`operario` / Acceso base Producción)
**Propósito:** Personal técnico en la línea de montaje. Trabajo rápido y repetitivo.
*   **Producción (`/produccion`):** Acceso a la terminal de Ensamblaje Automático. Selecciona un modelo pre-diseñado, escanea el código de serie e inicia el ensamblaje. El sistema valida automáticamente el stock en background.
*   **Dashboard (`/`):** Visualiza alertas de stock crítico para anticipar paradas en la línea.
*   *Restricciones:* No puede diseñar modelos, no puede ingresar stock manualmente, ni ver reportes financieros.

### 💼 Vendedor (`vendedor`)
**Propósito:** Personal del showroom y área comercial.
*   **Ventas (`/ventas`):** (Módulo Comercial). Gestiona la facturación, asocia clientes a compras y cambia el estado de los maniquíes de "Disponible" a "Vendido".
*   **Dashboard (`/`):** Consulta el catálogo de productos terminados.
*   *Restricciones:* No tiene acceso a Producción, Suministros ni Reportes de Rentabilidad. No interactúa con piezas sueltas, solo con productos ensamblados.

---

## 2. Flujo de Trabajo (Workflows)

El ciclo de vida de un maniquí atraviesa los tres roles en este orden:

1.  **[Gerente] Recepción (Suministros):** Llega un camión con piezas. El Gerente usa `/suministros` para registrar 50 Cabezas y 50 Torsos en el sistema.
2.  **[Gerente] Diseño (Modelos):** El Gerente entra a `/modelos`, usa la botonera para indicar que el "Modelo Base" necesita Cabeza y Torso, y lo guarda.
3.  **[Operario] Fabricación (Producción):** En la fábrica, el operario entra a `/produccion`, elige "Modelo Base", le pone un número de serie y ensambla. El sistema resta las piezas del stock.
4.  **[Vendedor] Comercialización (Ventas):** El maniquí terminado aparece en el sistema del showroom. El vendedor registra su venta, cambiando su estado final.

---

## 3. Seguridad en Frontend
Las barreras de acceso están implementadas en `src/routes/AppRouter.tsx` y `src/config/navigation.config.ts`. Si un usuario intenta forzar una URL para la cual no tiene permisos (ej. un vendedor intentando entrar a `/suministros`), el *Route Guard* intercepta la petición y lo redirige automáticamente al Dashboard.
