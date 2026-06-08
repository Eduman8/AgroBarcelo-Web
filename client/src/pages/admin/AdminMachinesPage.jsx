import { useMemo, useState } from 'react';

import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { machineCategories, machinesMock } from '../../data/machinesMock.js';

const emptyMachineForm = {
  nombre: '',
  categoria: '',
  estado: '',
  descripcionCorta: '',
  descripcionLarga: '',
  disponible: true
};

function createMachineId(nombre) {
  const slug = nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${slug || 'maquinaria'}-${Date.now()}`;
}

function AdminMachinesPage({ currentPath = '/admin/maquinarias' }) {
  const [machines, setMachines] = useState(machinesMock);
  const [formData, setFormData] = useState(emptyMachineForm);
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const formTitle = useMemo(
    () => (editingMachineId ? 'Editar maquinaria' : 'Nueva maquinaria'),
    [editingMachineId]
  );

  function handleNewMachine() {
    setFormData(emptyMachineForm);
    setEditingMachineId(null);
    setErrors({});
    setIsFormVisible(true);
  }

  function handleEditMachine(machine) {
    setFormData({
      nombre: machine.nombre,
      categoria: machine.categoria,
      estado: machine.estado,
      descripcionCorta: machine.descripcionCorta,
      descripcionLarga: machine.descripcionLarga,
      disponible: machine.disponible
    });
    setEditingMachineId(machine.id);
    setErrors({});
    setIsFormVisible(true);
  }

  function handleDeleteMachine(machineId) {
    setMachines((currentMachines) => currentMachines.filter((machine) => machine.id !== machineId));

    if (editingMachineId === machineId) {
      handleCancelForm();
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

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
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
      disponible: formData.disponible
    };

    if (editingMachineId) {
      setMachines((currentMachines) =>
        currentMachines.map((machine) =>
          machine.id === editingMachineId ? { ...machine, ...machinePayload } : machine
        )
      );
    } else {
      setMachines((currentMachines) => [
        ...currentMachines,
        {
          id: createMachineId(machinePayload.nombre),
          ...machinePayload
        }
      ]);
    }

    handleCancelForm();
  }

  return (
    <AdminLayout currentPath={currentPath}>
      <section className="admin-page-heading admin-machines-heading">
        <div>
          <p className="eyebrow">Maquinarias</p>
          <h1>Gestión de maquinarias</h1>
          <p>
            Desde aquí se administrarán las publicaciones de maquinarias, trabajos realizados y su
            disponibilidad comercial. Esta primera versión usa datos mock locales sin persistencia.
          </p>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={handleNewMachine}>
          Nueva maquinaria
        </button>
      </section>

      {isFormVisible && (
        <section className="admin-card admin-machine-form-card" aria-labelledby="admin-machine-form-title">
          <div className="admin-section-heading">
            <p className="eyebrow">Formulario</p>
            <h2 id="admin-machine-form-title">{formTitle}</h2>
          </div>

          <form className="admin-machine-form" onSubmit={handleSubmit} noValidate>
            <div className="admin-form-grid">
              <label>
                Nombre <span aria-hidden="true">*</span>
                <input
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.nombre)}
                />
                {errors.nombre && <small className="admin-form-error">{errors.nombre}</small>}
              </label>

              <label>
                Categoría <span aria-hidden="true">*</span>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.categoria)}
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
                Estado <span aria-hidden="true">*</span>
                <input
                  name="estado"
                  type="text"
                  value={formData.estado}
                  onChange={handleInputChange}
                  aria-invalid={Boolean(errors.estado)}
                  placeholder="Nueva, Usada, Finalizado..."
                />
                {errors.estado && <small className="admin-form-error">{errors.estado}</small>}
              </label>

              <label className="admin-checkbox-field">
                <input
                  name="disponible"
                  type="checkbox"
                  checked={formData.disponible}
                  onChange={handleInputChange}
                />
                Disponible para publicar/consultar
              </label>

              <label className="admin-form-field--wide">
                Descripción corta
                <textarea
                  name="descripcionCorta"
                  rows="3"
                  value={formData.descripcionCorta}
                  onChange={handleInputChange}
                />
              </label>

              <label className="admin-form-field--wide">
                Descripción larga
                <textarea
                  name="descripcionLarga"
                  rows="5"
                  value={formData.descripcionLarga}
                  onChange={handleInputChange}
                />
              </label>
            </div>

            <p className="admin-image-placeholder">La carga de imágenes será implementada próximamente.</p>

            <div className="admin-form-actions">
              <button className="admin-button admin-button--primary" type="submit">
                Guardar
              </button>
              <button className="admin-button admin-button--secondary" type="button" onClick={handleCancelForm}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-card" aria-labelledby="admin-machines-list-title">
        <div className="admin-section-heading">
          <p className="eyebrow">Listado</p>
          <h2 id="admin-machines-list-title">Maquinarias mock actuales</h2>
        </div>

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
                  <td data-label="Categoría">{machine.categoria}</td>
                  <td data-label="Estado">{machine.estado}</td>
                  <td data-label="Disponibilidad">
                    <span className={machine.disponible ? 'admin-status-pill' : 'admin-status-pill is-muted'}>
                      {machine.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <div className="admin-table-actions">
                      <button
                        className="admin-button admin-button--secondary"
                        type="button"
                        onClick={() => handleEditMachine(machine)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-button admin-button--danger"
                        type="button"
                        onClick={() => handleDeleteMachine(machine.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}

export default AdminMachinesPage;
