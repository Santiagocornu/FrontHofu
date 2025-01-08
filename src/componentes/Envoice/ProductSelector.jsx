import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; /* Importar SweetAlert2 */
import '../../Styles.css'; /* Asegúrate de importar el archivo de estilos */

const ProductSelector = ({ onAddProducts }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Cambia esta URL por la de tu API en Heroku
        const response = await axios.get('https://hofusushi-3869a82ef3b4.herokuapp.com/api/products');
        setProducts(response.data);
      } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, quantity, precio) => {
    if (quantity > 0) {
      setSelectedProducts({
        ...selectedProducts,
        [productId]: { quantity, precio }
      });
    } else {
      const updatedSelectedProducts = { ...selectedProducts };
      delete updatedSelectedProducts[productId];
      setSelectedProducts(updatedSelectedProducts);
    }
  };

  const handleAddProducts = () => {
    const productArray = Object.keys(selectedProducts).map((productId) => ({
      id_product: productId,
      quantity: selectedProducts[productId].quantity,
      precio: selectedProducts[productId].precio
    }));

    onAddProducts(productArray);
    setShowModal(false);

    // Mostrar alerta con SweetAlert2
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Productos añadidos con éxito'
    });
  };

  return (
    <div>
      <button type="button" className="modal-button" onClick={() => setShowModal(true)}>
        Seleccionar Productos
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Seleccionar Productos</h3>
            {products.map((product) => (
              <div key={product.id_product} className="product-item">
                {product.nombre_product} - ${product.precio}
                <input
                  type="number"
                  min="0"
                  placeholder="Cantidad"
                  onChange={(e) => handleQuantityChange(product.id_product, e.target.value, product.precio)}
                />
              </div>
            ))}
            <button type="button" className="cancel-button" onClick={handleAddProducts}>Agregar Productos</button>
            <button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
