import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert
import { EmployerContext } from '../../EmployerContext';
import EmployerSelector from './EmployerSelector';
import '../../Styles.css'; // Asegúrate de importar los estilos

const EmployerComponent = () => {
  const { selectedEmployerId, setSelectedEmployerId } = useContext(EmployerContext);
  const [employerDetails, setEmployerDetails] = useState(null);

  useEffect(() => {
    const storedEmployerId = localStorage.getItem('selectedEmployerId');
    if (storedEmployerId) {
      setSelectedEmployerId(Number(storedEmployerId));
    }
  }, [setSelectedEmployerId]);

  useEffect(() => {
    const fetchEmployerDetails = async () => {
      if (selectedEmployerId && !isNaN(selectedEmployerId)) {
        try {
          // Cambia esta URL por la de tu API en Heroku
          const response = await axios.get(`https://hofusushi-6bd7d2d065f9.herokuapp.com/api/employers/${selectedEmployerId}`);
          setEmployerDetails(response.data);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo conectar con el servidor: ' + error.message
          });
        }
      } else {
        setEmployerDetails(null);
      }
    };

    fetchEmployerDetails();
  }, [selectedEmployerId]);

  return (
    <div className="container">
      <h2>Seleccionar Empleado</h2>
      <div className="select-container">
        <EmployerSelector />
      </div>
      {employerDetails ? (
        <div className="details-box">
          <h2>Detalles del Empleado</h2>
          <p><strong>Nombre:</strong> {employerDetails.nombre_person}</p>
          <p><strong>Apellido:</strong> {employerDetails.apellido_person}</p>
          <p><strong>Email:</strong> {employerDetails.gmail_Employer}</p>
          <p><strong>Legajo:</strong> {employerDetails.legajo_Employer}</p>
          <p><strong>Turno:</strong> {employerDetails.turno_Employer}</p>
          <p><strong>Teléfono:</strong> {employerDetails.telefono_person}</p>
        </div>
      ) : (
        <p>No hay empleado seleccionado.</p>
      )}
    </div>
  );
};

export default EmployerComponent;
