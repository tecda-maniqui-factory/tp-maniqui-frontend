import { useState, useCallback } from 'react';

const translations: Record<string, string> = {
  'common.loading': 'Cargando...',
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.refresh': 'Actualizar',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'auth.login.title': 'Iniciar Sesión',
  'auth.login.username': 'Usuario',
  'auth.login.password': 'Contraseña',
  'auth.login.submit': 'Ingresar',
  'auth.login.error': 'Credenciales inválidas',
  'nav.home': 'Inicio',
  'nav.production': 'Producción',
  'nav.commercial': 'Ventas',
  'nav.logout': 'Cerrar Sesión',
  'production.title': 'Panel de Producción',
  'production.description': 'Gestión de ensamblaje y control de stock de maniquíes.',
  'production.maniquies_table': 'Lista de Maniquíes',
  'production.stock_piezas': 'Stock de Piezas',
  'production.error.title': 'Error de Producción',
  'production.error.fetch_failed': 'No se pudo obtener el listado de maniquíes.',
  'production.error.models_failed': 'No se pudo obtener los modelos de la API.',
  'production.error.assembly_failed': 'Fallo técnico en el ensamblaje. Verifique stock.',
  'production.success.assembly': 'Maniquí ensamblado y registrado con éxito.',
  'production.assembly.open_modal': 'Nuevo Ensamblaje',
  'production.assembly.modal_title': 'Registrar Ensamblaje Técnico',
  'production.assembly.model_label': 'Modelo de Maniquí',
  'production.assembly.model_placeholder': 'Seleccione el modelo a ensamblar',
  'production.assembly.model_help': 'El sistema validará el stock de piezas automáticamente.',
  'production.assembly.serie_label': 'Número de Serie',
  'production.assembly.serie_placeholder': 'Ej: MQ-2026-001',
  'production.assembly.serie_help': 'El número de serie debe ser único.',
  'production.assembly.submit': 'Confirmar Ensamblaje',
  'production.table.serie': 'Nro. Serie',
  'production.table.model': 'Modelo',
  'production.table.status': 'Estado',
  'production.table.date': 'Fecha Ensamblaje',
  'common.no_data': 'Sin datos disponibles'
};

/**
 * Hook para gestionar las traducciones y el lenguaje de la aplicación.
 */
export const useLanguage = () => {
  const [lang] = useState('es');

  const t = useCallback((key: string) => {
    return translations[key] || key;
  }, []);

  return { t, lang };
};
