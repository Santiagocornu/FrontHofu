import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalEditarStock from './ModalEditarStock'; // Importar el nuevo modal
import '../../Styles.css';
import Swal from 'sweetalert2';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [form, setForm] = useState({ id_Stock: '', nombre_stock: '', cantidad_stock: '' });
  const [searchNombre, setSearchNombre] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      // Cambia esta URL por la de tu API en Heroku
      const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/stock');
      setStocks(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error fetching stocks: ' + error.message, 'error');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleNombreChange = (event) => {
    setSearchNombre(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.id_Stock) {
      // Update existing stock
      try {
        await axios.put(`https://hofusushi-d77c0453ff79.herokuapp.com/api/stock/${form.id_Stock}`, form);
        Swal.fire('Éxito', 'Stock actualizado exitosamente', 'success');
        fetchStocks();
      } catch (error) {
        Swal.fire('Error', 'Error updating stock: ' + error.message, 'error');
      }
    } else {
      // Create new stock
      try {
        await axios.post('https://hofusushi-d77c0453ff79.herokuapp.com/api/stock', form);
        Swal.fire('Éxito', 'Stock creado exitosamente', 'success');
        fetchStocks();
      } catch (error) {
        Swal.fire('Error', 'Error creating stock: ' + error.message, 'error');
      }
    }
    setForm({ id_Stock: '', nombre_stock: '', cantidad_stock: '' });
  };

  const handleEdit = (stock) => {
    setForm(stock);
    setModalIsOpen(true); // Open the modal for editing
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/stock/${id}`);
      Swal.fire('Éxito', 'Stock eliminado exitosamente', 'success');
      fetchStocks();
    } catch (error) {
      Swal.fire('Error', 'Error deleting stock: ' + error.message, 'error');
    }
  };

  const getFilteredStocks = () => {
    return stocks.filter((stock) =>
      stock.nombre_stock.toLowerCase().includes(searchNombre.toLowerCase())
    );
  };

  return (
    <div className="container">
      <h2>Crear Stock</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="nombre_stock"
          value={form.nombre_stock}
          onChange={handleInputChange}
          placeholder="Nombre del stock"
          required
          className="modal-input"
        />
        <input
          type="text"
          name="cantidad_stock"
          value={form.cantidad_stock}
          onChange={handleInputChange}
          placeholder="Cantidad del stock"
          required
          className="modal-input"
        />
        <button type="submit" className="red-button">{form.id_Stock ? 'Actualizar' : 'Crear'}</button>
      </form>

      <h2>Buscar Stock</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchNombre}
        onChange={handleNombreChange}
        className="search-input"
      />
      
      <h2>Stock:</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredStocks().map((stock) => (
            <tr key={stock.id_Stock}>
              <td>{stock.id_Stock}</td>
              <td>{stock.nombre_stock}</td>
              <td>{stock.cantidad_stock}</td>
              <td>
                <button onClick={() => handleEdit(stock)} className="red-button">Editar</button>
                <button onClick={() => handleDelete(stock.id_Stock)} className="red-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for editing stocks */}
      <ModalEditarStock
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        stock={form} // Pasar los datos del stock seleccionado al modal
        onSave={(data) => { 
          handleSubmit({ ...data }); 
          setModalIsOpen(false); 
        }}
      />
    </div>
  );
};

export default Stock;
