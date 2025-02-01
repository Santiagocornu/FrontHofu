import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '../../Styles.css';

const ModalEditarProducto = ({ isOpen, onClose, producto, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_product: '',
    descripcion_product: '',
    precio: ''
  });

  useEffect(() => {
    if (producto) {
      setFormData(producto); // Cargar datos del producto al abrir el modal
    }
  }, [producto]);

  if (!isOpen) return null; // No renderizar el modal si no está abierto

  const handleSave = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Validar que los campos no estén vacíos antes de llamar a onSave
    if (!formData.nombre_product || !formData.descripcion_product || !formData.precio) {
      Swal.fire('Error', 'Por favor complete todos los campos.', 'error');
      return;
    }

    onSave(formData); // Llamar a la función onSave con los datos del formulario
    Swal.fire('Éxito', 'Producto editado exitosamente', 'success'); // Alerta de éxito
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
        <h2 className="modal-title">Editar Producto</h2>
        <form onSubmit={handleSave} className="modal-form">
          <label htmlFor="nombre_product" className="modal-label">Nombre del Producto:</label>
          <input
            type="text"
            id="nombre_product"
            name="nombre_product"
            value={formData.nombre_product || ''}
            onChange={handleChange}
            placeholder="Nombre del producto"
            required
            className="modal-input"
          />
          
          <label htmlFor="descripcion_product" className="modal-label">Descripción del Producto:</label>
          <input
            type="text"
            id="descripcion_product"
            name="descripcion_product"
            value={formData.descripcion_product || ''}
            onChange={handleChange}
            placeholder="Descripción del producto"
            required
            className="modal-input"
          />
          
          <label htmlFor="precio" className="modal-label">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio || ''}
            onChange={handleChange}
            placeholder="Precio"
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

export default ModalEditarProducto;
