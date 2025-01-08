import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import ClientSelector from './ClientSelector';
import ProductSelector from './ProductSelector';
import Swal from 'sweetalert2';
import '../../Styles.css'; /* Asegúrate de importar el archivo de estilos */

const EnvoiceCreateComponent = ({ fetchEnvoices }) => {
    const { selectedEmployerId } = useContext(EmployerContext);
    
    const [newEnvoice, setNewEnvoice] = useState({
        nombre_envoice: '',
        medioPago_envoice: '',
        total_envoice: 0, // Iniciamos con cero
        client_id: null,
        products: []
    });

    const calculateTotal = (products) => {
        return products.reduce((total, product) => total + (product.precio * product.quantity), 0);
    };

    useEffect(() => {
        setNewEnvoice(prevState => ({
            ...prevState,
            total_envoice: calculateTotal(prevState.products)
        }));
    }, [newEnvoice.products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEnvoice({ ...newEnvoice, [name]: value });
    };

    const handleCreateEnvoice = async () => {
        if (!selectedEmployerId) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No hay empleado seleccionado. Por favor selecciona un empleado.'
            });
            return;
        }

        try {
            // Cambia esta URL por la de tu API en Heroku
            await axios.post('https://hofusushi-3869a82ef3b4.herokuapp.com/api/envoices/createWithProducts', {
                ...newEnvoice,
                employer_id: selectedEmployerId,
                products: newEnvoice.products.map(product => ({
                    productId: product.id_product,
                    quantity: product.quantity
                }))
            });

            setNewEnvoice({ nombre_envoice: '', medioPago_envoice: '', total_envoice: 0, client_id: null, products: [] });
            fetchEnvoices();

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Envoice creado con éxito'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema creando el envoice. Por favor intenta de nuevo. ' + error.message
            });
        }
    };

    const handleSelectClient = (clientId) => {
        setNewEnvoice({ ...newEnvoice, client_id: clientId });
    };

    const handleAddProducts = (products) => {
        setNewEnvoice({ ...newEnvoice, products });
    };

    return (
        <div className="form-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <h2>Crear Envoice</h2>
            <form className="create-envoice-form" onSubmit={(e) => { e.preventDefault(); handleCreateEnvoice(); }}>
                <input
                    type="text"
                    name="nombre_envoice"
                    value={newEnvoice.nombre_envoice}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                />
                <input
                    type="text"
                    name="medioPago_envoice"
                    value={newEnvoice.medioPago_envoice}
                    onChange={handleInputChange}
                    placeholder="Medio de Pago"
                />
                <input
                    type="number"
                    name="total_envoice"
                    value={newEnvoice.total_envoice === 0 ? '' : newEnvoice.total_envoice}
                    readOnly
                    placeholder="Total"
                />
                <ClientSelector onSelectClient={handleSelectClient} />
                <ProductSelector onAddProducts={handleAddProducts} />
                <button type="submit" className="submit-button">Crear</button>
            </form>
        </div>
    );
};

export default EnvoiceCreateComponent;
