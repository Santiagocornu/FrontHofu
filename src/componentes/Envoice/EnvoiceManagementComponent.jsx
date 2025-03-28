import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EnvoiceCreateComponent from './EnvoiceCreateComponent';
import EnvoiceListComponent from './EnvoiceListComponent';
import '../../Styles.css';

const EnvoiceManagementComponent = () => {
    const [envoices, setEnvoices] = useState([]);

    const fetchEnvoices = async () => {
        try {
            const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices');
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

