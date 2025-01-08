import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import '../../Styles.css'; // Asegúrate de importar los estilos

const EmployerSelector = () => {
  const [employers, setEmployers] = useState([]);
  const { selectedEmployerId, setSelectedEmployerId } = useContext(EmployerContext);

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      // Cambia esta URL por la de tu API en Heroku
      const response = await axios.get('https://hofusushi-3869a82ef3b4.herokuapp.com/api/employers');
      setEmployers(response.data);
    } catch (error) {
      console.error('Error fetching employers:', error);
    }
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value)) {
      setSelectedEmployerId(Number(value));
      localStorage.setItem('selectedEmployerId', value); // Guardar en el almacenamiento local
    } else {
      console.error('Selected value is not a valid number');
    }
  };

  return (
    <div className="select-container">
      <select value={selectedEmployerId || ''} onChange={handleSelectChange}>
        <option value="">Seleccionar Empleado</option>
        {employers.map((employer) => (
          <option key={employer.id_person} value={employer.id_person}>
            {employer.nombre_person} {employer.apellido_person}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EmployerSelector;
