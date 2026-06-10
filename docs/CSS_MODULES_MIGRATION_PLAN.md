# Plan de Migración: CSS Modules (ECC Standard)

Este documento detalla la estrategia para migrar el sistema de estilos de **tp-maniqui-frontend** desde CSS Global (BEM) hacia **CSS Modules**. El objetivo es mejorar la encapsulación, evitar colisiones de nombres y facilitar la mantenibilidad a largo plazo.

## 📋 Objetivos Técnicos
1. **Encapsulamiento:** Limitar el alcance de los estilos al componente específico.
2. **Eliminación de BEM Manual:** Aprovechar el hashing automático de clases para simplificar los nombres.
3. **Mantenibilidad:** Facilitar la eliminación de código CSS muerto.
4. **Seguridad de Tipos:** (Opcional) Preparar el terreno para usar generadores de tipos para CSS Modules.

## 🛠️ Procedimiento de Ejecución

### Fase 1: Preparación y Renombrado
Para cada componente `Component.css`:
- Renombrar el archivo a `Component.module.css`.
- Identificar todas las clases BEM (`.block`, `.block__element`, `.block--modifier`).

### Fase 2: Refactorización de Componentes (.tsx)
1. Cambiar la importación:
   - De: `import './Component.css';`
   - A: `import styles from './Component.module.css';`
2. Actualizar las referencias a clases:
   - De: `className="component__element"`
   - A: `className={styles.element}` (usando camelCase para facilitar el acceso).

### Fase 3: Limpieza de Estilos Globales
- Mantener en `src/styles/` únicamente las variables (`variables.css`) y estilos base (`base.css`).
- Asegurarse de que las variables CSS (`--var`) sigan siendo accesibles mediante `:root`.

---

## 📝 Ejemplo de Referencia (Átomo: Button)

### Antes (BEM estándar)
**Button.css:**
```css
.button { ... }
.button__icon-block { ... }
.button--primary { ... }
```
**Button.tsx:**
```tsx
const finalClassName = ['button', 'button--primary'].join(' ');
return (
  <button className={finalClassName}>
    <div className="button__icon-block">...</div>
  </button>
);
```

### Después (CSS Modules)
**Button.module.css:**
```css
.button { ... }
.iconBlock { ... } /* Renombrado a camelCase */
.primary { ... }
```
**Button.tsx:**
```tsx
import styles from './Button.module.css';
// ...
const finalClassName = [styles.button, styles.primary].join(' ');
return (
  <button className={finalClassName}>
    <div className={styles.iconBlock}>...</div>
  </button>
);
```

---

## ✅ Checklist de Aplicación
- [ ] **Átomos:** Botones, Inputs, Badges, Spinners.
- [ ] **Moléculas:** FormFields, SearchBars.
- [ ] **Organismos:** Navbars, Modales, Tablas.
- [ ] **Features:** LoginForm, Dashboard, ProductionPage.
- [ ] **Layouts:** MainLayout, AuthLayout.

## ⚠️ Consideraciones de ECC
- **Nomenclatura:** Se recomienda convertir los nombres de clases de `kebab-case` a `camelCase` en el archivo CSS para poder acceder a ellos como `styles.myClass` en lugar de `styles['my-class']`.
- **Global Escape Hatch:** Para estilos que deban ser globales, usar el selector `:global(.className)`.

---
*Documentación generada para tp-maniqui-frontend - Junio 2026*
