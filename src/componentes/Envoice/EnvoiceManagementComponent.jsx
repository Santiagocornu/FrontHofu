import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert
import EnvoiceListComponent from './EnvoiceListComponent';
import EnvoiceCreateComponent from './EnvoiceCreateComponent';
import '../../Styles.css'; /* Asegúrate de importar el archivo de estilos */

const EnvoiceManagementComponent = () => {
  const [envoices, setEnvoices] = useState([]);

  const fetchEnvoices = async () => {
    try {
      // Cambia esta URL por la de tu API en Heroku
      const response = await axios.get('https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices');
      setEnvoices(response.data);
    } catch (error) {
      if (error.response) {
        Swal.fire('Error', 'Server responded with status: ' + error.response.status, 'error');
      } else if (error.request) {
        Swal.fire('Error', 'No response from server: ' + error.message, 'error');
      } else {
        Swal.fire('Error', 'Error in setting up request: ' + error.message, 'error');
      }
    }
  };

  useEffect(() => {
    fetchEnvoices();
  }, []);

  return (
    <div className="container">
      <h2>Gestión de Envoices</h2>
      <EnvoiceCreateComponent fetchEnvoices={fetchEnvoices} />
      <EnvoiceListComponent envoices={envoices} fetchEnvoices={fetchEnvoices} />
    </div>
  );
};

export default EnvoiceManagementComponent;
