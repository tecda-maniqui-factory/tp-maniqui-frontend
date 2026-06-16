# GEMINI.md — Tecda Maniquí Frontend Guidelines

This document provides quick reference instructions, build commands, and standards for the Tecda Maniquí Frontend service.

## 🛠️ Build and Development Commands

* **Install dependencies:** `pnpm install`
* **Build application:** `pnpm run build` (runs `vite build`)
* **Lint codebase:** `pnpm run lint` (runs `eslint .`)
* **Development mode:** `pnpm run dev` (runs `vite`)
* **Preview production build:** `pnpm run preview` (runs `vite preview`)

---

## 📂 Project Structure

* `src/config/`: App configuration (API URL, environment settings).
* `src/components/atoms/`: Small, reusable atomic UI components (Button, Input, Select).
* `src/components/molecules/`: Composite UI molecules (FormField, etc.).
* `src/components/organisms/`: Complex UI structures (PageHeader, cards, tables).
* `src/features/`: Feature-specific logic (auth, comercial, dashboard, produccion, suministros).
  * Each feature contains its components, API services, and custom hooks.
* `src/hooks/`: Global utility hooks (useAuth, useNotify, useLanguage).
* `src/routes/`: App routing and router declarations.

---

## 🎨 Code Style and Standards

1. **Type Safety:** Always declare types/interfaces for component props. Avoid using `any`.
2. **React Hooks:** 
   - Follow standard React Hooks rules.
   - Use `useCallback` for event handlers passed to child components.
   - Use `useMemo` for derived computations or filtering arrays/lists.
3. **State Management:** Mutate state immutably by returning new objects (e.g. `setSomething(prev => ({ ...prev, updated }))`).
4. **Performance:** Do not create objects/arrays inline in props if they cause redundant renders; memoize or hoist them.
