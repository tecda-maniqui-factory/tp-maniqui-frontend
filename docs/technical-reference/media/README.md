# 📖 Centro de Documentación del Cliente (Frontend)

Bienvenido al centro de documentación técnica del **Cliente Frontend** del proyecto **Tecda Maniquí**, correspondiente a la materia de **Prácticas Profesionalizantes**.

Aquí encontrarás toda la documentación detallada del diseño de la interfaz de usuario, los componentes interactivos React y las guías de estilos visuales.

## 🗺️ Mapa de Navegación

Para facilitar la exploración de la capa visual, la documentación se divide en las siguientes secciones detalladas:

1. ### 🎨 [Diseño Visual Obsidian Glassmorphism](styles.md) *(Próximamente)*
   * Guía completa de tokens CSS, degradados HSL, tarjetas Bento con efecto `backdrop-filter: blur(16px)` y microanimaciones de hovers fluidos.
   * Importación y uso de la tipografía **Outfit** desde Google Fonts.

2. ### 🧩 [Guía de Componentes y Vistas](components.md) *(Próximamente)*
   * Especificación de los cuatro cuadrantes del Dashboard de control (Monitor de Producción SQL, Terminal de Ensamblaje SP, Validador Anti-Frankenstein y Calculadora de Descuentos UDF).

3. ### 🛡️ [Manual de Operaciones y Roles](ROLES_Y_OPERACIONES.md)
   * Detalle completo del sistema RBAC, definiendo quién puede acceder a qué módulos (Producción, Diseño de Modelos, Suministros y Ventas).

---

## ⚡ Estándares de Rendimiento y Experiencia de Usuario

Nuestra interfaz está diseñada bajo estrictos estándares corporativos para ofrecer una experiencia premium al usuario:
* **Grid Symmetrical:** Diseños Bento Box proporcionales y responsivos para alta y baja resolución.
* **Manejo Visual de Excepciones:** Integración nativa de modales de advertencia premium cuando la base de datos devuelve errores controlados por triggers (como el código `409 Conflict` de incompatibilidad).
* **Carga de Fuentes Eficiente:** Fuentes cargadas de manera asíncrona evitando el parpadeo de texto sin estilo (FOUT).

---

> [!NOTE]
> Este frontend está configurado por defecto mediante Vite para ejecutarse en el **puerto `5173`** en desarrollo local y consumirá la API expuesta por el backend en el **puerto `8081`**.
