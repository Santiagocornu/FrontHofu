import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles.css'; /* Asegúrate de importar el archivo de estilos */
import EnvoiceEditComponent from './EnvoiceEditComponent';

const EnvoiceListComponent = ({ envoices, fetchEnvoices }) => {
  const [productsMap, setProductsMap] = useState({});
  const [editingEnvoiceId, setEditingEnvoiceId] = useState(null); // Estado para manejar la edición

  useEffect(() => {
    fetchAllProducts();
  }, [envoices]);

  const fetchAllProducts = async () => {
    try {
      const productsByEnvoice = {};
      for (const envoice of envoices) {
        const { data: envoiceProducts = [] } = await axios.get(`http://localhost:8080/api/envoices/${envoice.id_envoice}/products`);
        
        const { data: productsData = [] } = await axios.get(`http://localhost:8080/api/products`);
        const filteredProducts = productsData
          .map(product => {
            const productQuantity = envoiceProducts.find(ep => ep.productId === product.id_product)?.quantity || 0;
            return { ...product, quantity: productQuantity };
          })
          .filter(product => product.quantity > 0);

        productsByEnvoice[envoice.id_envoice] = filteredProducts;
      }

      setProductsMap(productsByEnvoice);
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
    }
  };

  const handleDeleteEnvoice = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/envoices/${id}`);
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
    setEditingEnvoiceId(id); // Establecer el ID de la envoice que se va a editar
  };

  const handleCloseEdit = () => {
    setEditingEnvoiceId(null); // Restablecer el ID de edición para cerrar el modal
  };

  return (
    <div className="container">
      <h2>Lista de Envoices</h2>
      {editingEnvoiceId ? (
        <EnvoiceEditComponent 
          envoiceId={editingEnvoiceId} 
          fetchEnvoices={fetchEnvoices} 
          onClose={handleCloseEdit} // Pasar la función onClose
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
            {envoices.map((envoice) => (
              <React.Fragment key={envoice.id_envoice}>
                <tr>
                  <td>{envoice.nombre_envoice}</td>
                  <td>{envoice.medioPago_envoice}</td>
                  <td>${envoice.total_envoice}</td>
                  <td>
                    <button onClick={() => handleEditClick(envoice.id_envoice)} className="edit-button">Editar</button>
                    <button onClick={() => handleDeleteEnvoice(envoice.id_envoice)} className="delete-button">Eliminar</button>
                  </td>
                </tr>
                {productsMap[envoice.id_envoice]?.map(product => (
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