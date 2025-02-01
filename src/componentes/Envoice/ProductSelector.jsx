import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles.css';

const ProductSelector = ({ onAddProducts, selectedProducts }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (product, quantity) => {
    if (quantity > 0) {
      onAddProducts({
        ...selectedProducts,
        [product.id_product]: { ...product, quantity }
      });
    } else {
      const updatedSelectedProducts = { ...selectedProducts };
      delete updatedSelectedProducts[product.id_product];
      onAddProducts(updatedSelectedProducts);
    }
  };

  const handleProductClick = (product) => {
    Swal.fire({
      title: 'Ingrese la cantidad deseada',
      input: 'number',
      inputAttributes: {
        min: 1,
        step: 1
      },
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      cancelButtonText: 'Cancelar',
      preConfirm: (quantity) => {
        return new Promise((resolve) => {
          if (!quantity || quantity <= 0) {
            Swal.showValidationMessage('Debe ingresar una cantidad válida');
          } else {
            resolve(quantity);
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = parseInt(result.value, 10);
        if (!isNaN(quantity) && quantity > 0) {
          handleQuantityChange(product, quantity);
          Swal.fire(
            'Añadido',
            `${product.nombre_product} añadido con cantidad: ${quantity}`,
            'success'
          );
        }
      }
    });
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = products.filter(product =>
      product.nombre_product.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };
  return (
    <div className="product-selector">
      <button type="button" className="red-button" onClick={() => setShowModal(true)}>
        Seleccionar Productos
      </button>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Seleccionar Productos</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Buscar producto..."
              className="search-input"
            />
            <div className="product-list">
              {filteredProducts.map((product) => (
                <div
                  key={product.id_product}
                  className="product-item"
                  onClick={() => handleProductClick(product)}
                >
                  {product.nombre_product} - ${product.precio}
                </div>
              ))}
            </div>
            <button type="button" className="red-button" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default ProductSelector;
