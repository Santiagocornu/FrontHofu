import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'; /* Importar SweetAlert2 */
import '../../Styles.css';

const ClientSelector = ({ onSelectClient }) => {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            // Cambia esta URL por la de tu API en Heroku
            const response = await axios.get('https://hofusushi-3869a82ef3b4.herokuapp.com/api/clients');
            setClients(response.data);
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor: ' + error.message, 'error');
        }
    };

    const handleSelectClient = (clientId) => {
        onSelectClient(clientId);
        setShowModal(false);
    };

    return (
        <div className="select-container">
            <button type="button" className="modal-button" onClick={() => setShowModal(true)}>
                ¿Seleccionar cliente de la base de datos?
            </button>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Seleccionar Cliente Para Añadir</h3>
                        <div className="client-list">
                            {clients.map((client) => (
                                <div key={client.id_person} className="client-item">
                                    <div className="client-info">
                                        <span className="client-name">{client.nombre_person} {client.apellido_person}</span>
                                        <span className="client-phone">{client.telefono_person}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="edit-button" // Usando la clase edit-button existente
                                        onClick={() => handleSelectClient(client.id_person)}>
                                        Seleccionar
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" className="delete-button" onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSelector;
