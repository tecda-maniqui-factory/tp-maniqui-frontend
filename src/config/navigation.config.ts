import { SidebarItem } from '@/components/organisms/layout/Sidebar';;

export const getSidebarItems = (pathname: string, role?: string): SidebarItem[] => {
  const items: SidebarItem[] = [
    { 
      id: '/', 
      label: 'Dashboard', 
      icon: 'Activity', 
      isActive: pathname === '/' 
    },
  ];

  if (role === 'operario' || role === 'gerente_prod') {
    items.push({ 
      id: '/produccion', 
      label: 'Producción', 
      icon: 'Factory', 
      isActive: pathname === '/produccion' 
    });
  }

  if (role === 'vendedor' || role === 'gerente_prod') {
    items.push({ 
      id: '/ventas', 
      label: 'Ventas', 
      icon: 'ShoppingCart', 
      isActive: pathname === '/ventas' 
    });
    items.push({ 
      id: '/clientes', 
      label: 'Clientes', 
      icon: 'Users', 
      isActive: pathname === '/clientes' 
    });
    items.push({ 
      id: '/presupuestos', 
      label: 'Presupuestos', 
      icon: 'FileText', 
      isActive: pathname === '/presupuestos' 
    });
  }

  if (role === 'gerente_prod') {
    items.push({ 
      id: '/modelos', 
      label: 'Diseñar Modelo', 
      icon: 'PencilRuler', 
      isActive: pathname === '/modelos' 
    });
    items.push({ 
      id: '/suministros', 
      label: 'Suministros', 
      icon: 'Truck', 
      isActive: pathname === '/suministros' 
    });
    items.push({ 
      id: '/reportes', 
      label: 'Reportes', 
      icon: 'ChartBar', 
      isActive: pathname === '/reportes' 
    });
  }

  return items;
};
