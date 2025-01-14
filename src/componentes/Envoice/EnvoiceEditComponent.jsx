import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import ClientSelector from './ClientSelector';
import ProductSelector from './ProductSelector';
import Swal from 'sweetalert2';
import '../../Styles.css';

const EnvoiceEditComponent = ({ envoiceId, fetchEnvoices, onClose }) => {
  const { selectedEmployerId } = useContext(EmployerContext);
  const [envoiceDetails, setEnvoiceDetails] = useState(null);

  const fetchEnvoiceDetails = useCallback(async () => {
    try {
      const response = await axios.get(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/${envoiceId}`);
      setEnvoiceDetails(response.data);
    } catch (error) {
      console.error('Error fetching envoice details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los detalles de la factura.'
      });
    }
  }, [envoiceId]);

  useEffect(() => {
    fetchEnvoiceDetails();
  }, [fetchEnvoiceDetails]);

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
      // Update the main envoice
      await axios.put(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/${envoiceId}`, {
        ...envoiceDetails,
        employer_id: selectedEmployerId
      });
  
      // Fetch existing envoiceProducts
      const { data: existingProducts } = await axios.get(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/${envoiceId}/products`);
  
      // Create a map for existing products for quick lookup
      const existingProductsMap = {};
      existingProducts.forEach(ep => {
        existingProductsMap[ep.productId] = ep;
      });
  
      // Update or create envoiceProducts
      for (const product of envoiceDetails.products) {
        const existingProduct = existingProductsMap[product.id_product];
  
        if (product.quantity > 0) {
          if (existingProduct) {
            // Update existing product
            await axios.put(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoiceProducts/${existingProduct.id}`, {
              envoiceId,
              productId: product.id_product,
              quantity: product.quantity
            });
          } else {
            // Create new product entry
            await axios.post(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoiceProducts`, {
              envoiceId,
              productId: product.id_product,
              quantity: product.quantity
            });
          }
        } else if (existingProduct) {
          // Delete product if quantity is 0
          const deleteResponse = await axios.delete(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoiceProducts/${existingProduct.id}`);
          if (deleteResponse.status !== 204) {
            console.error('Failed to delete envoiceProduct:', deleteResponse);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto de la factura.'
            });
          }
        }
      }
  
      fetchEnvoices();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Factura actualizada con éxito.'
      });
      onClose();
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
    setEnvoiceDetails((prev) => ({
      ...prev,
      products: selectedProducts,
      total_envoice: calculateTotal(selectedProducts),
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
                name="medioPago_envoice"
                value={envoiceDetails.medioPago_envoice}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Total:
              <input
                type="number"
                name="total_envoice"
                value={envoiceDetails.total_envoice === 0 ? '' : envoiceDetails.total_envoice}
                readOnly
                placeholder="Total"
              />
            </label>
            <ClientSelector onSelectClient={handleSelectClient} />
            <ProductSelector onAddProducts={handleAddProducts} />
            <button type="submit" className="submit-button">Actualizar</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
          </form>
        </div>
      </div>
    )
  );
};

export default EnvoiceEditComponent;
