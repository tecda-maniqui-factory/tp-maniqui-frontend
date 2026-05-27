import React, { FC, useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Checkbox from '@/components/atoms/Checkbox';
import Textarea from '@/components/atoms/Textarea';
import Spinner from '@/components/atoms/Spinner';
import Badge from '@/components/atoms/Badge';
import Card from '@/components/molecules/Card';
import Alert from '@/components/molecules/Alert';
import Modal from '@/components/organisms/Modal';
import Navbar from '@/components/organisms/Navbar';
import Sidebar, { SidebarItem } from '@/components/organisms/Sidebar';
import { LoginForm } from '@/features/auth';
import './App.css';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'Activity', isActive: true },
  { id: 'produccion', label: 'Producción', icon: 'Factory' },
  { id: 'comercial', label: 'Ventas', icon: 'ShoppingCart' },
  { id: 'clientes', label: 'Clientes', icon: 'Users' },
  { id: 'sistema', label: 'Sistema / Modelos', icon: 'Settings' },
];

const App: FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="app-layout">
      <Navbar 
        title="Tecda Maniquí ERP" 
        onMenuToggle={() => setSidebarOpen(!isSidebarOpen)}
        onLogout={() => alert('Cerrar sesión')}
      />
      
      <div className="app-layout__body">
        <Sidebar 
          isOpen={isSidebarOpen} 
          items={SIDEBAR_ITEMS} 
          onSelect={(id) => alert(`Seleccionaste: ${id}`)}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="app-main">
        <header className="app__header">
          <h1>Sistema de Diseño Flat UI</h1>
          <p>Demostración completa de Átomos, Moléculas y Organismos.</p>
        </header>

        {/* --- ÁTOMOS NUEVOS --- */}
        <section className="app__section">
          <h2>Átomos (Nuevos)</h2>
          
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <div>
              <h3>Spinners</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Spinner variant="primary" />
                <Spinner variant="success" />
                <Spinner variant="danger" />
                <Spinner variant="info" size={32} />
              </div>
            </div>

            <div>
              <h3>Badges</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Badge variant="success" iconName="CircleCheck">Activo</Badge>
                <Badge variant="warning" iconName="Clock">Pendiente</Badge>
                <Badge variant="danger">Suspendido</Badge>
                <Badge variant="primary">Nuevo</Badge>
              </div>
            </div>
          </div>

          <div className="app__form-demo" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3>Checkbox</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Checkbox label="Acepto los términos y condiciones" variant="primary" />
                <Checkbox label="Suscribirme al newsletter (Success)" variant="success" defaultChecked />
                <Checkbox label="Opción deshabilitada" isDisabled />
              </div>
            </div>
            <div>
              <h3>Textarea</h3>
              <Textarea 
                label="Notas de Ensamblaje" 
                placeholder="Indique si hubo daños en las piezas durante el proceso..." 
              />
            </div>
          </div>
        </section>

        {/* --- MOLÉCULAS --- */}
        <section className="app__section">
          <h2>Moléculas</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <Alert variant="info" title="Lote de Producción">
              El modelo Hombre Entero requiere más resina para finalizar su ensamblaje.
            </Alert>
            <Alert variant="danger" title="Error de Stock" onClose={() => alert('Cerrar alerta')}>
              No hay brazos derechos disponibles en el inventario de piezas.
            </Alert>
            <Alert variant="success">
              Venta atómica registrada exitosamente.
            </Alert>
          </div>

          <div style={{ maxWidth: '400px' }}>
            <Card 
              title="Detalle de Maniquí (Serie: M-1044)"
              footer={
                <>
                  <Button variant="secondary" iconName="Factory">Ensamblar</Button>
                  <Button variant="danger" iconName="Trash">Dañado</Button>
                </>
              }
            >
              <p><strong>Modelo:</strong> Torso Femenino</p>
              <p><strong>Estado actual:</strong> En Producción</p>
              <p><strong>Observaciones:</strong> Faltan detalles de pintura en la base.</p>
            </Card>
          </div>
        </section>

        {/* --- ORGANISMOS --- */}
        <section className="app__section">
          <h2>Organismos (Interacciones)</h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <Button variant="danger" iconName="TriangleAlert" onClick={() => setModalOpen(true)}>
              Abrir Modal de Confirmación
            </Button>
            
            <Modal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              title="Dar de Baja Maniquí"
              footer={
                <>
                  <Button variant="secondary" iconName="X" onClick={() => setModalOpen(false)}>Cancelar</Button>
                  <Button variant="danger" iconName="Trash">Eliminar Definitivamente</Button>
                </>
              }
            >
              <p>Estás a punto de marcar el Maniquí (Serie: M-1044) como defectuoso/dañado sin reparación posible.</p>
              <p>Esta acción lo removerá del stock disponible de ventas. ¿Continuar?</p>
            </Modal>
          </div>

          <h3>LoginForm Completo</h3>
          <div className="app__center-demo">
            <LoginForm />
          </div>
        </section>

        {/* --- OTROS --- */}
        <section className="app__section">
          <h2>Átomos Específicos</h2>
          <div className="app__form-demo">
            <Select 
              label="Estado de Producción (Info)"
              iconName="Factory"
              variant="info"
              options={[
                { value: 'en_produccion', label: 'En Producción' },
                { value: 'disponible', label: 'Disponible' },
                { value: 'vendido', label: 'Vendido' },
                { value: 'danado', label: 'Dañado' }
              ]}
            />
            <Select 
              label="Modelo Técnico (Primary)"
              iconName="Briefcase"
              variant="primary"
              options={[
                { value: '1', label: 'Hombre Entero Base' },
                { value: '2', label: 'Torso Femenino' }
              ]}
            />
          </div>
        </section>

      </main>
      </div>
    </div>
  );
};

export default App;
