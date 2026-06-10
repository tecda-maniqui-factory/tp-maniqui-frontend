# Frontend Architecture & Guidelines

## 1. Arquitectura de Componentes y Estilos

### Atomic Design
Clasificar componentes en:
- **atoms/**: Componentes básicos. Se dividen en:
  - **display/**: `Icon`, `Badge`.
  - **feedback/**: `Spinner`.
  - **form/**: `Button`, `Input`, `Select`, `Checkbox`, `Switch`, `Textarea`, `RadioGroup`.
  - Todos los botones deben usar el componente `<Button />` y todos los iconos deben usar el componente `<Icon />`. PROHIBIDO usar emojis o elementos nativos (como `<button>` o `<span>` con clases de iconos) directamente para estos propósitos.
- **molecules/**: Combinación de átomos (SearchBar, FormField).
- **organisms/**: Secciones complejas (Header, ReportTable).
- **templates/**: Layouts de página.
- **pages/**: Páginas completas.

### BEM CSS (Block Element Modifier)
- **Estricto uso de:** `block__element--modifier`.
- **Ejemplos:**
```css
.appointment-report { } /* Block */        
.appointment-report__table { } /* Element */                                         
.appointment-report__row--weekend { } /* Modifier */
```
- **Prohibido:** Tailwind, CSS-in-JS, inline styles, o camelCase/PascalCase en clases.

### Un Componente = Un CSS
Regla estricta: Cada archivo `.tsx` tiene su correspondiente `.css`. Queda estrictamente prohibido que un componente sobrescriba o modifique los estilos de sus componentes hijos a través de anidamiento CSS. Cada componente encapsula y define su propio estilo.

### Estructura de Contraste Visual (Bento Box)
- **Regla Anti-Camuflaje:** Nunca encadenar fondos grises sobre contenedores grises.
- **Jerarquía de Cajas:** Modal o app base utiliza `var(--card-bg)`. Paneles interactivos usan `var(--white)` puro acompañado de `border` y `box-shadow`.
- **Zonas Semánticas:** Alertas funcionales consumen fondos pálidos propios (`var(--red-50)`, `var(--blue-50)`).

### CSS (Tokens y BEM)
1. **Tokens Globales/Primitivos:** Solo colores crudos (`--blue-500`, `--white`). Residen en `variables.css`.
2. **Tokens Semánticos:** Definen roles genéricos (`--modal-bg`, `--card-bg`). Residen en `variables.css`.
3. **Tokens de Componente (Locales):** Las variables de componente NUNCA polucionan `variables.css`. Se declaran al inicio de la clase raíz BEM.

```css
/* ✅ CORRECTO - Tokens Locales y BEM */   
.appointment-admin-panel {                 
  --panel-bg: var(--white);                  
  --panel-border: var(--gray-300);           
}                                          
.appointment-admin-panel__group {          
  background-color: var(--panel-bg);         
}                                          
.appointment-report { }                    
.appointment-report__table { }             
.appointment-report__row { }               
.appointment-report__row--weekend { }      
.appointment-report__cell-amount { }       
```

```css
/* ❌ INCORRECTO */                       
.appointmentReport { } /* NO camelCase */  
.AppointmentReport { } /* NO PascalCase */ 
.table { } /* NO nombres genéricos */      
.row-weekend { } /* NO guiones simples para modificadores */                      
```

## 2. Modularidad por Características (Feature-Based)

### Lógica de Dominio
Encapsulada en `src/features/{feature_name}/`.
Estructura Estándar:
- `components/` → Componentes específicos.
- `hooks/` → Lógica de estado y side-effects (model/controller local).
- `index.ts` → Barrel file que exporta el orquestador y hooks clave.
- `FeaturePage.tsx` → Page principal (Orquestador).
- `FeaturePage.css` → Estilos globales de la página.

### Controllers (Custom Hooks)
- La lógica de orquestación reside en `useFeatureController.ts`.
- Las acciones se dividen en `useFeatureHandlers.ts` si la complejidad lo requiere.

```typescript
// ✅ CORRECTO - Custom Hook Controller    
export const useReportsController = () => {                                          
  const { t } = useLanguage();               
  const [activeTab, setActiveTab] = useState('appointments');                  
  const [reportData, setReportData] = useState(null);                            

  const handleGenerateReport = async () => {                                          
    // Lógica de negocio                       
  };                                         

  // Group all action handlers in a 'handlers' object                          
  const handlers = {                         
    handleGenerateReport,                      
    setActiveTab                               
  };                                         

  return {                                 
    activeTab,                                 
    reportData,                                
    handlers,                                  
    t                                          
  };                                         
}; 
```

### Orquestadores vs Ejecutores
- **Orquestadores:** Componentes de alto nivel (App, Routers, FeaturePage).
- **Ejecutores:** Átomos, Moléculas y Hooks de Lógica (useFetch, useHandlers). Si un orquestador tiene lógica compleja, debe extraerse a un hook controlador.

### Ejemplo de Componentes React

```tsx
// ✅ CORRECTO                             
import React, { FC } from 'react';                 
import './ComponentName.css';              

interface ComponentNameProps {
  prop1: string;
  prop2: number;
}

const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {                                       
  return (                                   
    <div className="component-name">           
      <h1 className="component-name__title">Título</h1>                                        
      <button className="component-name__button component-name__button--primary">          
        Acción                                     
      </button>                                  
    </div>                                     
  );                                         
};                                         
export default ComponentName;
```

```tsx
// ❌ INCORRECTO                                 
const ComponentName: FC<any> = ({ prop1, prop2 }) => {                                       
  return (                                   
    <div className="flex justify-center bg-blue-500"> {/* NO Tailwind */}          
      <h1 style={{ color: 'red' }}> {/* NO inline styles */}                          
        Título                                     
      </h1>                                      
    </div>                                     
  );                                         
};                                         
```

### Componentes de Tabla
Todos los reportes siguen la misma estructura (Resumen Diario arriba, Detalle Diario abajo).

```tsx
{/* Summary */}                             
Resumen Diario                             
{/* ... */}                                       
{/* Detail */}                             
<div className="report-name__group">       
  <h3 className="report-name__date-header">Fecha</h3>                                      
  <table className="report-name__table">     
    {/* ... */}                                
  </table>                                   
</div>  
```

## 3. Principios Fundamentales y React 19 Ready

### DRY (Don’t Repeat Yourself)
- Extraer lógica común en funciones/componentes reutilizables.
- Centralizar flujos de lógica.
- Centralizar configuraciones en un solo lugar.

### React 19 Ready
- **Priorizar:** `use(Context)` y evitar “Render-in-Render” (no definir funciones de renderizado dentro de otros componentes).
- **Tamaño de Componentes:** Si supera ~350 líneas, descomponer en sub-componentes.
- **Nomenclatura Semántica:** `handleSavePatient`, no `handleClick`.

### Optimización con Memoización
- Usar `useMemo` / `useCallback` solo si hay cálculos costosos, si se requiere igualdad referencial para `React.memo`, o si se pasan como dependencias.
- Los valores de los Context Providers DEBEN estar memorizados.

### i18n (Internacionalización)
- Cero texto crudo. Uso obligatorio de `t('key')`.
- Cero fallbacks hardcodeados (Prohibido `t('key') || 'Texto'`).

```typescript
// ✅ CORRECTO (Backend)
res.status(500).json({ error: 'server_error' });

// ✅ CORRECTO (Frontend)
try { 
  await api.put('/resource'); 
} catch (err) { 
  const errorMsg = err.response?.data?.error ? t(err.response.data.error) : t('failed_update'); 
  showMessage(errorMsg, 'error'); 
} 
```

### Estilo y Rutas Limpias
- Path Aliases: Usar `@/` para `src/`. Prohibidos paths relativos profundos.
- Lazy Loading: Componentes pesados deben cargarse mediante `React.lazy()` en un Suspense.

### Gestión de Errores
- **Aislamiento de Estado:** Los errores de formularios son locales al controlador.
- **Limpieza por Interacción:** Errores en formularios DEBEN limpiarse cuando el usuario empiece a interactuar (`onChange`).
- **Toasts vs Errores Locales:** Toasts para notificaciones de sistema, errores locales para validaciones.

## 4. Backend y Seguridad (MVC)

### Rutas
```typescript
// ✅ CORRECTO                             
const express = require('express');
const router = express.Router();                 
const controller = require('../controllers/controllerName');  
const { verifyToken } = require('../middleware/authMiddleware');   

router.get('/resource', verifyToken, controller.getResource);                   
router.post('/resource', verifyToken, controller.createResource);                

module.exports = router;                  
```

### Controladores
```typescript
// ✅ CORRECTO                             
exports.getResource = async (req, res) => {                                          
  let conn;                                  
  try {                                      
    const { param1, param2 } = req.query;      
    conn = await pool.getConnection();         
                                               
    // Lógica de negocio                       
    const result = await service.getData(param1, param2);           
                                               
    res.json(result);                          
  } catch (err) {                            
    console.error('Error:', err);              
    res.status(500).json({ error: 'Server Error' });                                 
  } finally {                                
    if (conn) conn.release();                  
  }                                          
};                                         
```

### Servicios
```typescript
// ✅ CORRECTO - Lógica de negocio separada                                   
const pool = require('../db');             

exports.getData = async (param1, param2) => {                                       
  const conn = await pool.getConnection();   
  try {                                      
    const query = `SELECT * FROM table WHERE field = ?`;                                
    const result = await conn.query(query, [param1]);                                 
    return result;                             
  } finally {                                
    if (conn) conn.release();                  
  }                                          
};                                         
```

### Seguridad y Repositorios
- **Protección SQL:** PROHIBIDO concatenar variables en strings de SQL.
- **Whitelisting:** Los métodos update deben usar `ALLOWED_FIELDS`.
- **sqlUtils:** Utilizar `@/utils/sqlUtils.ts` para consultas dinámicas.

### Rendimiento de Base de Datos (MariaDB)
- **Índices:** Obligatorios en `WHERE`, `ORDER BY`, `GROUP BY` o `JOIN`. Preferir índices compuestos.
- **Patrón JOINs:** OBLIGATORIO usar derived tables (JOINs pre-agregados). PROHIBIDO el uso de subconsultas correlacionadas para calcular agregados por fila.

```sql
-- ❌ INCORRECTO: Subconsultas correlacionadas (Se ejecuta N veces)
SELECT a.*, 
  (SELECT SUM(amount) FROM transactions t WHERE t.appointment_id = a.id AND t.status = 'paid') as paid 
FROM appointments a;

-- ✅ CORRECTO: JOINs pre-agregados (Se ejecuta 1 sola vez)
SELECT a.*, COALESCE(tx.paid_amount, 0) as paid 
FROM appointments a 
LEFT JOIN ( 
  SELECT appointment_id, SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount 
  FROM transactions 
  GROUP BY appointment_id 
) tx ON tx.appointment_id = a.id;
```
- **Lógica en Base de Datos:** Priorizar el uso de Vistas (Views) para consultas de múltiples JOINs, y Funciones/Procedimientos para cálculos de deuda.

## 5. Estándar de Respuesta de API y Reglas de Negocio

### Estándar de API (Listados)
- Estructura: `{ [nombre_entidad]: Array, totalCount: Number }`.

### Finanzas y Deudores
- **Turnos Futuros:** NO son deuda exigible hasta que ocurran.
- **Co-pago y Responsabilidad:** Paciente e institución tienen independencias de pago.

## 6. Git Flow
- `main`: Producción principal.
- `development`: Integración principal.
- `release-*`: Ramas de producción INTOCABLES.
- `feat/*`, `fix/*`, `chore/*`: Borrar inmediatamente después de su integración exitosa.

## 7. Reglas de IA
- **🚫 PROHIBICIÓN DEL BROWSER TOOL:** TERMINANTEMENTE PROHIBIDO utilizar browser_subagent o read_url en localhost. La IA debe basarse en descripción visual del USER.
