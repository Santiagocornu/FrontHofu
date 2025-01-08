import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles.css'; 
import EnvoiceEditComponent from './EnvoiceEditComponent';

const EnvoiceListComponent = ({ envoices, fetchEnvoices }) => {
  const [productsMap, setProductsMap] = useState({});
  const [editingEnviceId, setEditingEnviceId] = useState(null);

  const fetchAllProducts = useCallback(async () => {
    try {
      const productsByEnvice = {};
      for (const envice of envoices) {
        const { data: enviceProducts = [] } = await axios.get(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/${envice.id_envice}/products`);
        
        const { data: productsData = [] } = await axios.get(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/products`);
        
        const filteredProducts = productsData
          .map(product => {
            const productQuantity = enviceProducts.find(ep => ep.productId === product.id_product)?.quantity || 0;
            return { ...product, quantity: productQuantity };
          })
          .filter(product => product.quantity > 0);

        productsByEnvice[envice.id_envice] = filteredProducts;
      }

      setProductsMap(productsByEnvice);
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
    }
  }, [envoices]);

  useEffect(() => {
    fetchAllProducts();
  }, [envoices, fetchAllProducts]);

  const handleDeleteEnvice = async (id) => {
    try {
      await axios.delete(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/${id}`);
      Swal.fire('Éxito', 'Envoice eliminada con éxito', 'success');
      fetchEnvoices();
      setProductsMap((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      Swal.fire('Error', 'Error al eliminar la envoice: ' + error.message, 'error');
    }
  };

  const handleEditClick = (id) => {
    setEditingEnviceId(id);
  };

  const handleCloseEdit = () => {
    setEditingEnviceId(null);
  };

  return (
    <div className="container">
      <h2>Lista de Envoices</h2>
      {editingEnviceId ? (
        <EnvoiceEditComponent 
          envoiceId={editingEnviceId} 
          fetchEnvoices={fetchEnvoices} 
          onClose={handleCloseEdit} 
        />
      ) : (
        <table className="table-container">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Medio de Pago</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {envoices.map((envice) => (
              <React.Fragment key={envice.id_envice}>
                <tr>
                  <td>{envice.nombre_envoice}</td>
                  <td>{envice.medioPago_envoice}</td>
                  <td>${envice.total_envoice}</td>
                  <td>
                    <button onClick={() => handleEditClick(envice.id_envice)} className="edit-button">Editar</button>
                    <button onClick={() => handleDeleteEnvice(envice.id_envice)} className="delete-button">Eliminar</button>
                  </td>
                </tr>
                {productsMap[envice.id_envice]?.map(product => (
                  <tr key={product.id_product} className="product-item-row">
                    <td colSpan="4">
                      <div className="product-item">
                        <span>{product.nombre_product}</span>
                        <span>Cantidad: {product.quantity}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnvoiceListComponent;
