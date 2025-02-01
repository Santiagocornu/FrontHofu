// ModalEditarStock.js
import React, { useEffect, useState } from 'react';
import '../../Styles.css';
import Swal from 'sweetalert2';

const ModalEditarStock = ({ isOpen, onClose, stock, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_stock: '',
    cantidad_stock: ''
  });

  useEffect(() => {
    if (stock) {
      setFormData(stock); // Cargar datos del stock al abrir el modal
    }
  }, [stock]);

  if (!isOpen) return null; // No renderizar el modal si no está abierto

  const handleSave = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    if (!formData.nombre_stock || !formData.cantidad_stock) {
      Swal.fire('Error', 'Por favor complete todos los campos.', 'error');
      return;
    }
    onSave(formData); // Llamar a la función onSave con los datos del formulario
    Swal.fire('Éxito', 'Stock editado exitosamente', 'success'); // Alerta de éxito
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
        <h2 className="modal-title">Editar Stock</h2>
        <form onSubmit={handleSave} className="modal-form">
          <label htmlFor="nombre_stock" className="modal-label">Nombre del Stock:</label>
          <input
            type="text"
            id="nombre_stock"
            name="nombre_stock"
            value={formData.nombre_stock || ''}
            onChange={handleChange}
            placeholder="Nombre del stock"
            required
            className="modal-input"
          />
          
          <label htmlFor="cantidad_stock" className="modal-label">Cantidad:</label>
          <input
            type="text"
            id="cantidad_stock"
            name="cantidad_stock"
            value={formData.cantidad_stock || ''}
            onChange={handleChange}
            placeholder="Cantidad del stock"
            required
            className="modal-input"
          />
          
          <button type="submit" className="red-button">Guardar</button>
          <button type="button" className="red-button cancel-button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </>
  );
};

export default ModalEditarStock;
