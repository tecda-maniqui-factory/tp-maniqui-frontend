import { FC } from 'react';
import { AppRouter } from '@/routes/AppRouter';
import './App.css';

/**
 * Componente Raíz: App
 * Actúa como orquestador de nivel superior, delegando la navegación al AppRouter.
 */
const App: FC = () => {
  return <AppRouter />;
};

export default App;
