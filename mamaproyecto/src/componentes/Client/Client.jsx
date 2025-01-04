import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ModalEditarCliente from './ModalEditarCliente';
import '../../Styles.css'

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState({});
  const [form, setForm] = useState({ id_person: '', nombre_person: '', apellido_person: '', telefono_person: '', preferencia_client: '' });

  // Función para obtener clientes
  const fetchClientes = async () => {
    const controller = new AbortController();
    try {
      const response = await axios.get('http://localhost:8080/api/clients', {
        signal: controller.signal,
      });
      setClientes(response.data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        Swal.fire('Error', 'Error al obtener los clientes: ' + error.message, 'error');
      }
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []); // Asegúrate de que las dependencias estén vacías

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (form.id_person) {
        // Actualizar cliente existente
        await axios.put(`http://localhost:8080/api/clients/${form.id_person}`, form);
        Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
      } else {
        // Crear nuevo cliente
        await axios.post('http://localhost:8080/api/clients', form);
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
      const response = await axios.delete(`http://localhost:8080/api/clients/${id}`);
      Swal.fire('Éxito', response.data, 'success'); // Muestra el mensaje devuelto por el servidor
      fetchClientes(); // Volver a cargar clientes después de eliminar
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        Swal.fire('Error', error.response.data || 'Error desconocido', 'error'); // Muestra el mensaje específico del error
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        Swal.fire('Error', 'No se recibió respuesta del servidor.', 'error');
      } else {
        // Algo pasó al configurar la solicitud
        Swal.fire('Error', 'Error al eliminar el cliente: ' + error.message, 'error');
      }
    }
  };

  const handleModalSave = async (cliente) => {
    try {
      await axios.put(`http://localhost:8080/api/clients/${cliente.id_person}`, cliente);
      Swal.fire('Éxito', 'Cliente actualizado exitosamente', 'success');
      fetchClientes(); // Volver a cargar clientes después de actualizar
    } catch (error) {
      Swal.fire('Error', 'Error al actualizar el cliente: ' + error.message, 'error');
    }
    setModalIsOpen(false);
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
        <button type="submit" className="submit-button">{form.id_person ? 'Actualizar' : 'Crear'}</button>
      </form>
      
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
          {clientes.map((cliente) => (
            <tr key={cliente.id_person}>
              <td>{cliente.id_person}</td>
              <td>{cliente.nombre_person}</td>
              <td>{cliente.apellido_person}</td>
              <td>{cliente.telefono_person}</td>
              <td>{cliente.preferencia_client}</td>
              <td>
                <button onClick={() => handleEdit(cliente)} className="edit-button">Editar</button>
                <button onClick={() => handleDelete(cliente.id_person)} className="delete-button">Eliminar</button>
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

