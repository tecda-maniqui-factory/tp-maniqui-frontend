import { FC } from 'react';
import PageHeader from '@/components/organisms/layout/PageHeader';
import Modal from '@/components/organisms/feedback/Modal';;
import Spinner from '@/components/atoms/feedback/Spinner';
import Button from '@/components/atoms/form/Button';
import Input from '@/components/atoms/form/Input';;
import FormField from '@/components/molecules/form/FormField';;
import { useClientesController } from './hooks/useClientesController';
import './ClientesPage.css';

/**
 * ClientesPage — vista de gestión de clientes.
 * Permite listar, buscar y crear clientes.
 */
const ClientesPage: FC = () => {
  const {
    clientes,
    clientesFiltrados,
    search,
    isLoading,
    isModalOpen,
    isSubmitting,
    nombre,
    cuitCuil,
    email,
    formError,
    setSearch,
    setNombre,
    setCuitCuil,
    setEmail,
    handleOpenModal,
    handleCloseModal,
    handleCreateCliente,
    handleRefresh,
  } = useClientesController();

  return (
    <div className="clientes-page">
      {/* ── Cabecera ── */}
      <PageHeader
        title="Gestión de Clientes"
        subtitle="Administrá el registro de clientes de la empresa"
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label="Recargar lista de clientes"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Actualizar
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenModal}
              aria-label="Agregar nuevo cliente"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nuevo Cliente
            </Button>
          </div>
        }
      />

      {/* ── Stats ── */}
      <div className="clientes-stats">
        <div className="stat-card">
          <div className="stat-icon indigo" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{clientes.length}</span>
            <span className="stat-label">Total Clientes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{clientesFiltrados.length}</span>
            <span className="stat-label">Resultados</span>
          </div>
        </div>
      </div>

      {/* ── Barra de búsqueda ── */}
      <div className="clientes-toolbar">
        <div className="clientes-search-wrapper">
          <span className="clientes-search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            id="clientes-search"
            type="search"
            className="clientes-search-input"
            placeholder="Buscar por nombre, CUIT/CUIL o email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Buscar clientes"
          />
        </div>
        {search && (
          <span className="clientes-count">
            {clientesFiltrados.length} de {clientes.length} clientes
          </span>
        )}
      </div>

      {/* ── Tabla ── */}
      <div className="clientes-table-card">
        {isLoading ? (
          <div className="clientes-empty">
            <Spinner size="lg" />
            <p>Cargando clientes…</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="clientes-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {search ? (
              <>
                <p>No se encontraron clientes con ese criterio.</p>
                <span>Probá con otro nombre, CUIT/CUIL o email.</span>
              </>
            ) : (
              <>
                <p>Todavía no hay clientes registrados.</p>
                <span>Hacé clic en "Nuevo Cliente" para agregar el primero.</span>
              </>
            )}
          </div>
        ) : (
          <div className="clientes-table-wrapper">
            <table className="clientes-table" aria-label="Listado de clientes">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">CUIT / CUIL</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(c => (
                  <tr key={c.id}>
                    <td>
                      <span className="cliente-id-badge">{c.id}</span>
                    </td>
                    <td className="cliente-nombre">{c.nombre}</td>
                    <td>
                      <code className="cliente-cuit">{c.cuit_cuil}</code>
                    </td>
                    <td>
                      {c.email ? (
                        <a
                          href={`mailto:${c.email}`}
                          className="cliente-email"
                          aria-label={`Enviar email a ${c.nombre}`}
                        >
                          {c.email}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted, #9ca3af)' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal: Nuevo Cliente ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nuevo Cliente"
      >
        <form
          id="form-nuevo-cliente"
          onSubmit={handleCreateCliente}
          className="cliente-form"
          noValidate
          aria-label="Formulario de nuevo cliente"
        >
          <FormField label="Nombre o Razón Social" required>
            <Input
              id="cliente-nombre"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Tienda Ejemplo S.A."
              required
              autoComplete="organization"
              aria-required="true"
            />
          </FormField>

          <FormField label="CUIT / CUIL" required>
            <Input
              id="cliente-cuit"
              type="text"
              value={cuitCuil}
              onChange={e => setCuitCuil(e.target.value)}
              placeholder="00-00000000-0"
              required
              inputMode="numeric"
              aria-required="true"
              aria-describedby="cuit-hint"
            />
            <p id="cuit-hint" className="cliente-form-hint">
              Formato: XX-XXXXXXXX-X
            </p>
          </FormField>

          <FormField label="Email de contacto">
            <Input
              id="cliente-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contacto@empresa.com"
              autoComplete="email"
            />
          </FormField>

          {formError && (
            <div className="cliente-form-error" role="alert">
              {formError}
            </div>
          )}

          <div className="cliente-form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando…' : 'Crear Cliente'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientesPage;
