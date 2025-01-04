import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import ClientSelector from './ClientSelector';
import ProductSelector from './ProductSelector'; // Importar ProductSelector
import Swal from 'sweetalert2';
import '../../Styles.css'; /* Asegúrate de importar el archivo de estilos */

const EnvoiceEditComponent = ({ envoiceId, fetchEnvoices, onClose }) => {
  const { selectedEmployerId } = useContext(EmployerContext);
  const [envoiceDetails, setEnvoiceDetails] = useState(null);

  useEffect(() => {
    fetchEnvoiceDetails();
  }, [envoiceId]);

  const fetchEnvoiceDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/envoices/${envoiceId}`);
      setEnvoiceDetails(response.data);
    } catch (error) {
      console.error('Error fetching envoice details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los detalles de la factura.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnvoiceDetails({ ...envoiceDetails, [name]: value });
  };

  const handleUpdateEnvoice = async () => {
    if (!selectedEmployerId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No hay empleado seleccionado. Por favor, selecciona un empleado.'
      });
      return;
    }

    if (!envoiceDetails.nombre_envoice || !envoiceDetails.medioPago_envoice || envoiceDetails.total_envoice <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Por favor completa todos los campos requeridos.'
      });
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/envoices/${envoiceId}`, {
        ...envoiceDetails,
        employer_id: selectedEmployerId
      });
      fetchEnvoices();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Factura actualizada con éxito.'
      });
      onClose(); // Cerrar el modal después de actualizar
    } catch (error) {
      console.error('Error updating envoice:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la factura. Por favor intenta de nuevo.'
      });
    }
  };

  const handleSelectClient = (clientId) => {
    setEnvoiceDetails({ ...envoiceDetails, client_id: clientId });
  };

  const handleAddProducts = (selectedProducts) => {
    // Actualizar los detalles de la factura con los productos seleccionados
    setEnvoiceDetails((prev) => ({
      ...prev,
      products: selectedProducts,
      total_envoice: calculateTotal(selectedProducts), // Calcular el nuevo total
    }));
  };

  const calculateTotal = (products) => {
    return products.reduce((total, product) => total + (product.precio * product.quantity), 0);
  };

  return (
    envoiceDetails && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Editar Envoice</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateEnvoice(); }}>
            <label>
              Nombre:
              <input
                type="text"
                name="nombre_envoice"
                value={envoiceDetails.nombre_envoice}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Medio de Pago:
              <input
                type="text"
                name="medioPago_envice"
                value={envoiceDetails.medioPago_envice}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Total:
              <input
                type="number"
                name="total_envice"
                value={envoiceDetails.total_envice === 0 ? '' : envoiceDetails.total_envice}
                readOnly
                placeholder="Total"
              />
            </label>
            <ClientSelector onSelectClient={handleSelectClient} />
            {/* Agregar ProductSelector para seleccionar productos */}
            <ProductSelector onAddProducts={handleAddProducts} />
            <button type="submit" className="submit-button">Actualizar</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button> {/* Botón de cancelar */}
          </form>
        </div>
      </div>
    )
  );
};

export default EnvoiceEditComponent;
