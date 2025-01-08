import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert
import ModalEditarProducto from './ModalEditarProducto';
import '../../Styles.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ id_product: '', nombre_product: '', descripcion_product: '', precio: '' });
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Cambia esta URL por la de tu API en Heroku
      const response = await axios.get('https://hofusushi-3869a82ef3b4.herokuapp.com/api/products');
      setProducts(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error fetching products: ' + error.message, 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (data) => { // Cambiar aquí para recibir data
    try {
      if (data.id_product) {
        await axios.put(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/products/${data.id_product}`, data);
        Swal.fire('Éxito', 'Producto actualizado exitosamente', 'success');
      } else {
        await axios.post('https://hofusushi-3869a82ef3b4.herokuapp.com/api/products', data);
        Swal.fire('Éxito', 'Producto creado exitosamente', 'success');
      }
      fetchProducts();
      setForm({ id_product: '', nombre_product: '', descripcion_product: '', precio: '' });
    } catch (error) {
      Swal.fire('Error', 'Error saving product: ' + error.message, 'error');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm(product);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hofusushi-3869a82ef3b4.herokuapp.com/api/products/${id}`);
      Swal.fire('Éxito', 'Producto eliminado exitosamente', 'success');
      fetchProducts();
    } catch (error) {
      Swal.fire('Error', 'Error deleting product: ' + error.message, 'error');
    }
  };

  return (
    <div className="container">
      <h2>Crear Producto</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(form); }} className="form-container">
        <input
          type="text"
          name="nombre_product"
          value={form.nombre_product}
          onChange={handleInputChange}
          placeholder="Nombre del producto"
          required
          className="modal-input"
        />
        <input
          type="text"
          name="descripcion_product"
          value={form.descripcion_product}
          onChange={handleInputChange}
          placeholder="Descripción del producto"
          required
          className="modal-input"
        />
        <input
          type="number"
          name="precio"
          value={form.precio}
          onChange={handleInputChange}
          placeholder="Precio"
          required
          className="modal-input"
        />
        <button type="submit" className="submit-button">{form.id_product ? 'Actualizar' : 'Crear'}</button>
      </form>
      
      <h2>Productos:</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id_product}>
              <td>{product.id_product}</td>
              <td>{product.nombre_product}</td>
              <td>{product.descripcion_product}</td>
              <td>{product.precio}</td>
              <td>
                <button onClick={() => handleEdit(product)} className="edit-button">Editar</button>
                <button onClick={() => handleDelete(product.id_product)} className="delete-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing products */}
      <ModalEditarProducto
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        producto={selectedProduct}
        onSave={(data) => { 
          handleSubmit(data); // Llamar a handleSubmit con los datos del formulario
          setModalIsOpen(false); 
        }}
      />
    </div>
  );
};

export default Product;
