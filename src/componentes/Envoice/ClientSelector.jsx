import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import '../../Styles.css';

const ClientSelector = ({ onSelectClient }) => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            // Cambia esta URL por la de tu API en Heroku
            const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/clients');
            setClients(response.data);
            setFilteredClients(response.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = clients.filter(client =>
            `${client.nombre_person} ${client.apellido_person}`.toLowerCase().includes(query)
        );
        setFilteredClients(filtered);
    };

    const handleSelectClient = (client) => {
        const clientName = `${client.nombre_person} ${client.apellido_person}`;
        onSelectClient(client.id_person, clientName);
        setShowModal(false);

        Swal.fire({
            icon: 'success',
            title: 'Cliente Añadido',
            text: `Se ha añadido el cliente: ${clientName}`,
        });
    };

    const handleNoDatabaseClient = () => {
        onSelectClient(null, null); // No actualiza el nombre del input
        setShowModal(false);
        Swal.fire({
            icon: 'info',
            title: 'Cliente Añadido',
            text: 'Seleccionaste: No está en la base de datos'
        });
    };

    return (
        <div className="select-container">
            <button type="button" className="red-button" onClick={() => setShowModal(true)}>
                ¿Seleccionar cliente de la base de datos?
            </button>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Seleccionar Cliente Para Añadir</h3>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Buscar cliente..."
                            className="search-input"
                        />
                        <div className="client-list">
                            {filteredClients.map((client) => (
                                <div key={client.id_person} className="client-item">
                                    <div className="client-info">
                                        <span className="client-name">{client.nombre_person} {client.apellido_person}</span>
                                        <span className="client-phone">{client.telefono_person}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="red-button" 
                                        onClick={() => handleSelectClient(client)}>
                                        Seleccionar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button 
                            type="button" 
                            className="red-button" 
                            onClick={handleNoDatabaseClient}>
                            No está en la base de datos
                        </button>
                        <button type="button" className="red-button" onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSelector;
