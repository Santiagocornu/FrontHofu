import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalEditarCliente from './ModalEditarCliente'; // Asegúrate de que este componente esté importado

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState({});
  const [form, setForm] = useState({ id_person: '', nombre_person: '', apellido_person: '', telefono_person: '', preferencia_client: '' });
  const [searchNombre, setSearchNombre] = useState('');
  const [searchApellido, setSearchApellido] = useState('');

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/clients');
      setClientes(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al obtener los clientes: ' + error.message, 'error');
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleNombreChange = (event) => {
    setSearchNombre(event.target.value);
  };

  const handleApellidoChange = (event) => {
    setSearchApellido(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (form.id_person) {
        // Actualizar cliente existente
        await axios.put(`https://hofusushi-d77c0453ff79.herokuapp.com/api/clients/${form.id_person}`, form);
        Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
      } else {
        // Crear nuevo cliente
        await axios.post('https://hofusushi-d77c0453ff79.herokuapp.com/api/clients', form);
        Swal.fire('Éxito', 'Cliente creado exitosamente', 'success');
      }
      fetchClientes(); // Volver a cargar clientes después de la operación
    } catch (error) {
      Swal.fire('Error', 'Error al guardar el cliente: ' + error.message, 'error');
    }
    setForm({ id_person: '', nombre_person: '', apellido_person: '', telefono_person: '', preferencia_client: '' });
  };

  const handleEdit = (cliente) => {
    setSelectedCliente(cliente);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/clients/${id}`);
      Swal.fire('Éxito', response.data, 'success');
      fetchClientes(); // Volver a cargar clientes después de eliminar
    } catch (error) {
      Swal.fire('Error', 'Error al eliminar el cliente: ' + error.message, 'error');
    }
  };

  const handleModalSave = async (cliente) => {
    try {
      await axios.put(`https://hofusushi-d77c0453ff79.herokuapp.com/api/clients/${cliente.id_person}`, cliente);
      Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
      fetchClientes(); // Volver a cargar clientes después de actualizar
    } catch (error) {
      Swal.fire('Error', 'Error al actualizar el cliente: ' + error.message, 'error');
    }
    setModalIsOpen(false);
  };

  const getFilteredClientes = () => {
    return clientes.filter((cliente) =>
      cliente.nombre_person.toLowerCase().includes(searchNombre.toLowerCase()) &&
      cliente.apellido_person.toLowerCase().includes(searchApellido.toLowerCase())
    );
  };

  return (
    <div className="container">
      <h2>Crear Clientes</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="nombre_person"
          value={form.nombre_person}
          onChange={handleInputChange}
          placeholder="Nombre del cliente"
          required
        />
        <input
          type="text"
          name="apellido_person"
          value={form.apellido_person}
          onChange={handleInputChange}
          placeholder="Apellido del cliente"
          required
        />
        <input
          type="text"
          name="telefono_person"
          value={form.telefono_person}
          onChange={handleInputChange}
          placeholder="Teléfono del cliente"
          required
        />
        <input
          type="text"
          name="preferencia_client"
          value={form.preferencia_client}
          onChange={handleInputChange}
          placeholder="Preferencia del cliente"
          required
        />
        <button type="submit" className="red-button">{form.id_person ? 'Actualizar' : 'Crear'}</button>
      </form>
      
      <h2>Buscar Clientes</h2>
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={searchNombre}
        onChange={handleNombreChange}
        className="search-input"
      />
      <input
        type="text"
        placeholder="Buscar por apellido"
        value={searchApellido}
        onChange={handleApellidoChange}
        className="search-input"
      />
  
      <h2>Clientes:</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Preferencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredClientes().map((cliente) => (
            <tr key={cliente.id_person}>
              <td>{cliente.id_person}</td>
              <td>{cliente.nombre_person}</td>
              <td>{cliente.apellido_person}</td>
              <td>{cliente.telefono_person}</td>
              <td>{cliente.preferencia_client}</td>
              <td>
                <button onClick={() => handleEdit(cliente)} className="red-button">Editar</button>
                <button onClick={() => handleDelete(cliente.id_person)} className="red-button">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <ModalEditarCliente
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        cliente={selectedCliente}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Cliente;
