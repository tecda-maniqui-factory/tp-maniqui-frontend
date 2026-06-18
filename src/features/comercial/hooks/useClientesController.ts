import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNotify } from '@/hooks/useNotify';
import { useLanguage } from '@/hooks/useLanguage';
import { comercialService, Cliente } from '../api/comercialService';

/**
 * Hook Controlador para el Módulo de Gestión de Clientes.
 */
export const useClientesController = () => {
  const { token, logout } = useAuth();
  const notify = useNotify();
  const { t } = useLanguage();

  // --- Estado de datos ---
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState('');

  // --- Estado de UI ---
  const [isLoading, setIsLoading] = useState(!!token);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estado de formulario ---
  const [nombre, setNombre] = useState('');
  const [cuitCuil, setCuitCuil] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // --- Clientes filtrados por búsqueda ---
  const clientesFiltrados = clientes.filter(c => {
    const q = search.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.cuit_cuil.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  // --- Carga inicial ---
  const loadClientes = useCallback(async (showLoading = false) => {
    if (!token) return;
    if (showLoading) setIsLoading(true);
    try {
      const data = await comercialService.getClientes(token);
      setClientes(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        notify(t('commercial.error.fetch_failed'), 'danger');
      }
    } finally {
      setIsLoading(false);
    }
  }, [token, logout, notify, t]);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await Promise.resolve();
      if (isMounted) loadClientes(true);
    };
    init();
    return () => { isMounted = false; };
  }, [loadClientes]);

  // --- Abrir / cerrar modal ---
  const handleOpenModal = useCallback(() => {
    setNombre('');
    setCuitCuil('');
    setEmail('');
    setFormError(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setFormError(null);
  }, []);

  // --- Crear cliente ---
  const handleCreateCliente = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setFormError(null);

    if (nombre.trim().length < 3) {
      setFormError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    const cuitRegex = /^[0-9]{2}-[0-9]{8}-[0-9]{1}$/;
    if (!cuitRegex.test(cuitCuil)) {
      setFormError(t('commercial.error.cuit_invalid'));
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('El email ingresado no es válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const nuevo = await comercialService.createCliente(token, {
        nombre: nombre.trim(),
        cuit_cuil: cuitCuil,
        email
      });

      setClientes(prev => [...prev, nuevo]);
      handleCloseModal();
      notify(t('commercial.success.client_created'), 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === 'auth.error.session_expired') {
        logout();
      } else {
        setFormError(t(msg) || t('commercial.error.client_failed'));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [token, nombre, cuitCuil, email, notify, t, logout, handleCloseModal]);

  return {
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
    handleRefresh: () => loadClientes(true),
    t,
  };
};
