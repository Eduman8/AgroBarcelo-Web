import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '../../components/admin/AdminLayout.jsx';
import {
  createMachine,
  deleteMachine,
  getAdminMachines,
  updateMachine
} from '../../services/machinesService.js';
import { getMachineCategory, getMachineStatus, machineCategories, machineStatuses } from '../../utils/machines.js';

const emptyMachineForm = {
  nombre: '',
  categoria: '',
  estado: 'Disponible',
  descripcionCorta: '',
  descripcionLarga: '',
  disponible: true
};

function AdminMachinesPage({ currentPath = '/admin/maquinarias' }) {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState(emptyMachineForm);
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveMessage, setSaveMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingMachineId, setDeletingMachineId] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const formTitle = useMemo(
    () => (editingMachineId ? 'Editar maquinaria' : 'Nueva maquinaria'),
    [editingMachineId]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadMachines() {
      setIsLoading(true);
      setLoadError('');
      setIsUsingFallback(false);

      try {
        const response = await getAdminMachines();

        if (!isMounted) {
          return;
        }

        setMachines(Array.isArray(response) ? response : []);

        if (response?.isFallback) {
          setIsUsingFallback(true);
          setLoadError('No se pudo conectar con la API real. Se muestran maquinarias mock temporalmente.');
        }
      } catch (currentError) {
        if (isMounted) {
          setMachines([]);
          setLoadError(currentError.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMachines();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleNewMachine() {
    setFormData(emptyMachineForm);
    setEditingMachineId(null);
    setErrors({});
    setSaveMessage('');
    setActionError('');
    setIsFormVisible(true);
  }

  function handleEditMachine(machine) {
    setFormData({
      nombre: machine.nombre ?? '',
      categoria: getMachineCategory(machine),
      estado: getMachineStatus(machine),
      descripcionCorta: machine.descripcionCorta ?? '',
      descripcionLarga: machine.descripcionLarga ?? '',
      disponible: getMachineStatus(machine) === 'Disponible'
    });
    setEditingMachineId(machine.id);
    setErrors({});
    setSaveMessage('');
    setActionError('');
    setIsFormVisible(true);
  }

  async function handleDeleteMachine(machineId) {
    if (isUsingFallback) {
      setActionError('La API real no está disponible. No se puede eliminar usando datos mock temporales.');
      return;
    }

    setDeletingMachineId(machineId);
    setActionError('');
    setSaveMessage('');

    try {
      await deleteMachine(machineId);
      setMachines((currentMachines) => currentMachines.filter((machine) => machine.id !== machineId));

      if (editingMachineId === machineId) {
        handleCancelForm();
      }

      setSaveMessage('Maquinaria eliminada correctamente.');
    } catch (currentError) {
      setActionError(currentError.message);
    } finally {
      setDeletingMachineId(null);
    }
  }

  function handleCancelForm() {
    setFormData(emptyMachineForm);
    setEditingMachineId(null);
    setErrors({});
    setIsFormVisible(false);
  }

  function handleInputChange(event) {
    const { name, type, value, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: nextValue
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: ''
      }));
    }
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es requerido.';
    }

    if (!formData.categoria.trim()) {
      nextErrors.categoria = 'La categoría es requerida.';
    }

    if (!formData.estado.trim()) {
      nextErrors.estado = 'El estado es requerido.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isUsingFallback) {
      setActionError('La API real no está disponible. No se puede guardar usando datos mock temporales.');
      return;
    }

    const machinePayload = {
      nombre: formData.nombre.trim(),
      categoria: formData.categoria.trim(),
      estado: formData.estado.trim(),
      descripcionCorta: formData.descripcionCorta.trim(),
      descripcionLarga: formData.descripcionLarga.trim(),
      imagenPrincipal: null,
      galeria: [],
      disponible: formData.estado === 'Disponible',
      activo: true
    };

    setIsSaving(true);
    setActionError('');
    setSaveMessage('');

    try {
      const savedMachine = editingMachineId
        ? await updateMachine(editingMachineId, machinePayload)
        : await createMachine(machinePayload);

      if (editingMachineId) {
        setMachines((currentMachines) =>
          currentMachines.map((machine) => (machine.id === editingMachineId ? savedMachine : machine))
        );
      } else {
        setMachines((currentMachines) => [savedMachine, ...currentMachines]);
      }

      handleCancelForm();
      setSaveMessage('Maquinaria guardada correctamente.');
    } catch (currentError) {
      setActionError(currentError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-machines-heading">
        <div>
          <p className="eyebrow">Maquinarias</p>
          <h1>Gestión de maquinarias</h1>
          <p>
            Desde aquí se administran las publicaciones de maquinarias, trabajos realizados y su
            disponibilidad comercial con persistencia real en la API.
          </p>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={handleNewMachine}>
          Nueva maquinaria
        </button>
      </section>

      {saveMessage && (
        <div className="admin-save-message" role="status">
          {saveMessage}
        </div>
      )}
      {loadError && <p className="status-message status-message--error">{loadError}</p>}
      {actionError && <p className="status-message status-message--error">{actionError}</p>}

      {isFormVisible && (
        <section className="admin-card admin-machine-form-card" aria-labelledby="admin-machine-form-title">
          <div className="admin-section-heading">
            <p className="eyebrow">Formulario</p>
            <h2 id="admin-machine-form-title">{formTitle}</h2>
          </div>

          <form className="admin-machine-form" onSubmit={handleSubmit} noValidate>
            <div className="admin-form-grid">
              <label>
                <span className="admin-field-label">
                  Nombre <span aria-hidden="true">*</span>
                </span>
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.nombre)}
                  disabled={isSaving}
                />
                {errors.nombre && <small className="admin-form-error">{errors.nombre}</small>}
              </label>

              <label>
                <span className="admin-field-label">
                  Categoría <span aria-hidden="true">*</span>
                </span>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.categoria)}
                  disabled={isSaving}
                >
                  <option value="">Seleccionar categoría</option>
                  {machineCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.categoria && <small className="admin-form-error">{errors.categoria}</small>}
              </label>

              <label>
                <span className="admin-field-label">
                  Estado <span aria-hidden="true">*</span>
                </span>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.estado)}
                  disabled={isSaving}
                >
                  <option value="">Seleccionar estado</option>
                  {machineStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                {errors.estado && <small className="admin-form-error">{errors.estado}</small>}
              </label>

              <div className="admin-checkbox-field" aria-live="polite">
                <span>
                  {formData.estado === 'Vendida'
                    ? 'Las maquinarias vendidas se publican como historial y sin detalle público.'
                    : 'Las maquinarias disponibles permiten consulta y acceso al detalle público.'}
                </span>
              </div>

              <label className="admin-form-field--wide">
                <span className="admin-field-label">Descripción corta</span>
                <textarea
                  name="descripcionCorta"
                  rows="3"
                  value={formData.descripcionCorta}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </label>

              <label className="admin-form-field--wide">
                <span className="admin-field-label">Descripción larga</span>
                <textarea
                  name="descripcionLarga"
                  rows="5"
                  value={formData.descripcionLarga}
                  onChange={handleInputChange}
                  disabled={isSaving}
                />
              </label>
            </div>

            <section className="admin-images-section" aria-labelledby="admin-machine-images-title">
              <div className="admin-section-heading admin-section-heading--compact">
                <p className="eyebrow">Imágenes</p>
                <h3 id="admin-machine-images-title">Imágenes de la publicación</h3>
                <p>La carga de imágenes será implementada próximamente.</p>
              </div>

              <div className="admin-image-placeholder-grid">
                <div className="admin-image-placeholder">
                  <span>Imagen principal</span>
                </div>
                <div className="admin-image-placeholder admin-image-placeholder--gallery">
                  <span>Galería</span>
                </div>
              </div>
            </section>

            <div className="admin-form-actions">
              <button className="admin-button admin-button--primary" type="submit" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar maquinaria'}
              </button>
              <button
                className="admin-button admin-button--secondary"
                type="button"
                onClick={handleCancelForm}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-card" aria-labelledby="admin-machines-list-title">
        <div className="admin-section-heading">
          <p className="eyebrow">Listado</p>
          <h2 id="admin-machines-list-title">Maquinarias actuales</h2>
        </div>

        {isLoading ? (
          <p className="status-message">Cargando maquinarias...</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-machines-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Disponibilidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.id}>
                    <td data-label="Nombre">{machine.nombre}</td>
                    <td data-label="Categoría">{getMachineCategory(machine)}</td>
                    <td data-label="Estado">{getMachineStatus(machine)}</td>
                    <td data-label="Disponibilidad">
                      <span
                        className={
                          getMachineStatus(machine) === 'Disponible'
                            ? 'admin-status-pill'
                            : 'admin-status-pill is-muted'
                        }
                      >
                        {getMachineStatus(machine) === 'Disponible' ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className="admin-table-actions">
                        <button
                          className="admin-button admin-button--secondary"
                          type="button"
                          onClick={() => handleEditMachine(machine)}
                          disabled={deletingMachineId === machine.id}
                        >
                          Editar
                        </button>
                        <button
                          className="admin-button admin-button--danger"
                          type="button"
                          onClick={() => handleDeleteMachine(machine.id)}
                          disabled={deletingMachineId === machine.id}
                        >
                          {deletingMachineId === machine.id ? 'Eliminando...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {machines.length === 0 ? (
              <p className="status-message machines-empty">No hay maquinarias cargadas.</p>
            ) : null}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default AdminMachinesPage;
