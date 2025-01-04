import React, { useEffect, useState } from 'react';
import '../../Styles.css'
const ModalEditarCliente = ({ isOpen, onClose, cliente, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_person: '',
    apellido_person: '',
    telefono_person: '',
    preferencia_client: ''
  });

  useEffect(() => {
    if (cliente) {
      setFormData(cliente); // Cargar datos del cliente al abrir el modal
    }
  }, [cliente]);

  if (!isOpen) return null; // No renderizar el modal si no está abierto

  const handleSave = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    onSave(formData); // Llamar a la función onSave con los datos del formulario
    onClose(); // Cerrar el modal después de guardar
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); // Actualizar el estado del formulario
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div> {/* Superposición */}
      <div className="modal">
        <h2 className="modal-title">Editar Cliente</h2>
        <form onSubmit={handleSave} className="modal-form">
          <label htmlFor="nombre_person" className="modal-label">Nombre del Cliente:</label>
          <input
            type="text"
            id="nombre_person"
            name="nombre_person"
            value={formData.nombre_person || ''}
            onChange={handleChange} // Manejo controlado del cambio
            placeholder="Nombre del cliente"
            required
            className="modal-input"
          />
          
          <label htmlFor="apellido_person" className="modal-label">Apellido del Cliente:</label>
          <input
            type="text"
            id="apellido_person"
            name="apellido_person"
            value={formData.apellido_person || ''}
            onChange={handleChange}
            placeholder="Apellido del cliente"
            required
            className="modal-input"
          />
          
          <label htmlFor="telefono_person" className="modal-label">Teléfono del Cliente:</label>
          <input
            type="text"
            id="telefono_person"
            name="telefono_person"
            value={formData.telefono_person || ''}
            onChange={handleChange}
            placeholder="Teléfono del cliente"
            required
            className="modal-input"
          />
          
          <label htmlFor="preferencia_client" className="modal-label">Preferencia del Cliente:</label>
          <input
            type="text"
            id="preferencia_client"
            name="preferencia_client"
            value={formData.preferencia_client || ''}
            onChange={handleChange}
            placeholder="Preferencia del cliente"
            required
            className="modal-input"
          />
          
          <button type="submit" className="modal-button">Guardar</button>
          <button type="button" className="modal-button cancel-button" onClick={onClose}>Cancelar</button>
        </form>
      </div>

    </>
  );
};

export default ModalEditarCliente;
