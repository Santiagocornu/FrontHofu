import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles.css'; 
import EnvoiceEditComponent from './EnvoiceEditComponent';

const EnvoiceListComponent = ({ fetchEnvoices }) => {
  const [envoices, setEnvoices] = useState([]);
  const [filteredEnvoices, setFilteredEnvoices] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [editingEnvoiceId, setEditingEnvoiceId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEnvoicesWithSales = useCallback(async () => {
    try {
      const { data: envoicesData } = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices');
      const { data: salesData } = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/sales');
      const envoicesWithoutSales = envoicesData.filter(envoice => !salesData.some(sale => sale.envoice_id === envoice.id_envoice));
      setEnvoices(envoicesWithoutSales);
      setFilteredEnvoices(envoicesWithoutSales);
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
    }
  }, []);

  const fetchAllProducts = useCallback(async () => {
    try {
      const productsByEnvoice = {};
      for (const envoice of envoices) {
        const { data: envoiceProducts } = await axios.get(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoiceProducts/envoice/${envoice.id_envoice}`);
        const { data: productsData } = await axios.get(`https://hofusushi-d77c0453ff79.herokuapp.com/api/products`);
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
  }, [envoices]);

  useEffect(() => {
    fetchEnvoicesWithSales();
  }, [fetchEnvoicesWithSales]);

  useEffect(() => {
    if (envoices.length > 0) {
      fetchAllProducts();
    }
  }, [envoices, fetchAllProducts]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = envoices.filter(envoice =>
      envoice.nombre_envoice.toLowerCase().includes(query)
    );
    setFilteredEnvoices(filtered);
  };

  const handleDeleteEnvoice = async (id) => {
    try {
      await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices/${id}`);
      Swal.fire('Éxito', 'Envoice eliminada con éxito', 'success');
      fetchEnvoicesWithSales();
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
    setEditingEnvoiceId(id);
  };

  const handleCloseEdit = () => {
    setEditingEnvoiceId(null);
  };

  const handleFinishEnvoice = async (id_envoice, total_envoice) => {
    Swal.fire({
      title: '¿Estás segura que quieres terminar este pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, terminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const currentDate = new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
        const saleData = {
          monto_sale: total_envoice,
          fecha_sale: currentDate,
          envoice_id: id_envoice
        };

        try {
          await axios.post('https://hofusushi-d77c0453ff79.herokuapp.com/api/sales', saleData);
          Swal.fire('Éxito', 'Venta creada con éxito', 'success');
          fetchEnvoicesWithSales();
          setProductsMap((prev) => {
            const updated = { ...prev };
            delete updated[id_envoice];
            return updated;
          });
        } catch (error) {
          Swal.fire('Error', 'No se pudo crear la venta: ' + error.message, 'error');
          console.error('Error creating sale:', error);
        }
      }
    });
  };

  return (
    <div className="container">
      <h2>Lista de Envoices</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Buscar por nombre..."
        className="search-input"
      />
      {editingEnvoiceId ? (
        <EnvoiceEditComponent 
          envoiceId={editingEnvoiceId} 
          fetchEnvoices={fetchEnvoicesWithSales} 
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
            {filteredEnvoices.map((envoice) => (
              <React.Fragment key={envoice.id_envoice}>
                <tr>
                  <td>{envoice.nombre_envoice}</td>
                  <td>{envoice.medioPago_envoice}</td>
                  <td>${envoice.total_envoice}</td>
                  <td>
                    <button onClick={() => handleEditClick(envoice.id_envoice)} className="red-button">Editar</button>
                    <button onClick={() => handleDeleteEnvoice(envoice.id_envoice)} className="red-button">Eliminar</button>
                    <button 
                      onClick={() => handleFinishEnvoice(envoice.id_envoice, envoice.total_envoice)} 
                      className="red-button"
                    >
                      Terminar
                    </button>
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
