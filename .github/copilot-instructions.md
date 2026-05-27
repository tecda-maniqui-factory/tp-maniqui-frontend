# Instrucciones Globales (tp-maniqui-frontend)

Estás operando en el proyecto `tp-maniqui-frontend`. 

Antes de sugerir, modificar o crear código para este proyecto, es **ESTRICTAMENTE OBLIGATORIO** que apliques las reglas arquitectónicas y convenciones definidas en el siguiente archivo:
`docs/ARCHITECTURE.md`

## Reglas clave (Resumen)
1. **Atomic Design & BEM CSS:** Uso obligatorio de estructura atómica (atoms, molecules, organisms, templates, pages) y sintaxis BEM pura (`block__element--modifier`). Prohibido Tailwind o CSS-in-JS.
2. **Modularidad:** Toda la lógica de dominio se encapsula en `src/features/{feature_name}/`.
3. **React 19:** Priorizar `use(Context)`, evitar "Render-in-Render" y usar nombres semánticos (ej: `handleSavePatient`).
4. **Un componente = Un CSS:** Nada de CSS inline. Cada componente tiene su propio archivo CSS y no poluciona ni modifica a sus hijos. Obligatorio el uso de TypeScript (`.tsx`, `.ts`).
5. **i18n:** Cero texto crudo en el código. Siempre usa `t('key')` sin fallbacks hardcodeados.
6. **Bases de datos y APIs:** Manejo de fechas con utilidades (nunca manual), formato estándar de respuesta para listas, y uso de JOINs pre-agregados en BD.

Si tienes dudas sobre cómo implementar o refactorizar un componente, lee detenidamente `docs/ARCHITECTURE.md` para encontrar el patrón de diseño a seguir.
