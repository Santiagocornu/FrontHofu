import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import ProductSelector from './ProductSelector';
import Swal from 'sweetalert2';
import '../../Styles.css';

const EnvoiceEditComponent = ({ envoiceId, fetchEnvoices, onClose }) => {
  const { selectedEmployerId } = useContext(EmployerContext);
  const [envoiceDetails, setEnvoiceDetails] = useState(null);
  const [productsToRemove, setProductsToRemove] = useState([]);

  const fetchEnvoiceDetails = useCallback(async () => {
    try {
      const response = await axios.get(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices/${envoiceId}`);
      const envoiceProductsResponse = await axios.get(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoiceProducts/envoice/${envoiceId}`);
      
      const envoiceProducts = envoiceProductsResponse.data;
      
      const products = await Promise.all(envoiceProducts.map(async (envoiceProduct) => {
        const productResponse = await axios.get(`https://hofusushi-d77c0453ff79.herokuapp.com/api/products/${envoiceProduct.productId}`);
        return {
          ...productResponse.data,
          quantity: envoiceProduct.quantity,
          envoiceProductId: envoiceProduct.id // Incluyendo el id correcto
        };
      }));
      
      setEnvoiceDetails({ ...response.data, products });
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
      await axios.put(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices/${envoiceId}`, {
        ...envoiceDetails,
        employer_id: selectedEmployerId
      });

      // Delete products that were marked for removal
      for (const productId of productsToRemove) {
        await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoiceProducts/${productId}`);
      }

      // Create new envoiceProducts if they don't exist
      for (const product of envoiceDetails.products) {
        if (!product.envoiceProductId) {
          await axios.post('https://hofusushi-d77c0453ff79.herokuapp.com/api/envoiceProducts', {
            envoiceId,
            productId: product.id_product,
            quantity: product.quantity
          });
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

  const handleAddProducts = (selectedProducts) => {
    const productsArray = Object.values(selectedProducts);
    setEnvoiceDetails((prev) => ({
      ...prev,
      products: productsArray,
      total_envoice: calculateTotal(productsArray),
    }));
  };

  const handleRemoveProduct = (productId) => {
    const productToRemove = envoiceDetails.products.find(product => product.id_product === productId);
    setProductsToRemove((prev) => [...prev, productToRemove.envoiceProductId]);
    setEnvoiceDetails((prev) => {
      const updatedProducts = prev.products.filter(product => product.id_product !== productId);
      return {
        ...prev,
        products: updatedProducts,
        total_envoice: calculateTotal(updatedProducts),
      };
    });
  };

  const calculateTotal = (products) => {
    return Array.isArray(products)
      ? products.reduce((total, product) => total + (product.precio * product.quantity), 0)
      : 0;
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
            <ProductSelector onAddProducts={handleAddProducts} selectedProducts={envoiceDetails.products.reduce((acc, product) => {
              acc[product.id_product] = product;
              return acc;
            }, {})} />
            <div className="selected-products-list">
              <h4>Productos Seleccionados:</h4>
              <table className="table-container">
                <thead>
                  <tr>
                    <th>Nombre del Producto</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {envoiceDetails.products.map(product => (
                    <tr key={product.id_product} className="product-item-row">
                      <td>{product.nombre_product}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button type="button" className="red-button" onClick={() => handleRemoveProduct(product.id_product)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button type="submit" className="red-button">Actualizar</button>
            <button type="button" className="red-button cancel-button" onClick={onClose}>Cancelar</button>
          </form>
        </div>
      </div>
    )
  );
  
};

export default EnvoiceEditComponent;
