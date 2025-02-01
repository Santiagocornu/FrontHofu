import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { EmployerContext } from '../../EmployerContext';
import ClientSelector from './ClientSelector';
import ProductSelector from './ProductSelector';
import Swal from 'sweetalert2';
import '../../Styles.css';

const EnvoiceCreateComponent = ({ fetchEnvoices }) => {
    const { selectedEmployerId } = useContext(EmployerContext);

    const [newEnvoice, setNewEnvoice] = useState({
        nombre_envoice: '',
        medioPago_envoice: '',
        total_envoice: 0,
        client_id: null,
        descripcion_envoice: '',
        employer_id: selectedEmployerId,
        products: []
    });

    const [selectedClientName, setSelectedClientName] = useState('');

    const calculateTotal = (products) => {
        return products.reduce((total, product) => {
            const productTotal = product.precio * product.quantity;
            return total + (isNaN(productTotal) ? 0 : productTotal);
        }, 0);
    };

    useEffect(() => {
        setNewEnvoice(prevState => ({
            ...prevState,
            total_envoice: calculateTotal(prevState.products)
        }));
    }, [newEnvoice.products]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setNewEnvoice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddProducts = (selectedProducts) => {
        setNewEnvoice(prevState => ({
            ...prevState,
            products: Object.keys(selectedProducts).map(productId => ({
                id_product: productId,
                nombre_product: selectedProducts[productId].nombre_product,
                quantity: selectedProducts[productId].quantity,
                precio: selectedProducts[productId].precio
            }))
        }));
    };

    const handleRemoveProduct = (productId) => {
        setNewEnvoice(prevState => ({
            ...prevState,
            products: prevState.products.filter(product => product.id_product !== productId)
        }));
    };

    const handleCreateEnvoice = async () => {
        if (!newEnvoice.employer_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'Debe seleccionar un empleador antes de crear la factura'
            });
            return;
        }

        const { products, ...envoiceData } = newEnvoice;
        const productIds = products.map(product => product.id_product);
        const quantities = products.map(product => product.quantity);

        if (!newEnvoice.client_id) {
            envoiceData.client_id = null;
        }

        console.log("Data being sent to backend:", { ...envoiceData, productIds, quantities }); // For debugging

        try {
            const params = new URLSearchParams();
            params.append('productIds', productIds.join(','));
            params.append('quantities', quantities.join(','));

            await axios.post(
                `https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices/createWithProducts?${params.toString()}`,
                envoiceData
            );

            // Reset the form after successful creation
            setNewEnvoice({
                nombre_envoice: '',
                medioPago_envoice: '',
                total_envoice: 0,
                descripcion_envoice: '',
                client_id: null,
                employer_id: selectedEmployerId,
                products: []
            });

            setSelectedClientName('');

            fetchEnvoices(); // Refresh the list of envoices

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Factura creada con éxito'
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema creando la factura. Por favor intenta de nuevo. ' + error.message
            });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateEnvoice(); }}>
                <input
                    type="text"
                    name="nombre_envoice"
                    value={selectedClientName || newEnvoice.nombre_envoice}
                    onChange={(e) => {
                        handleInputChange(e);
                        setSelectedClientName('');
                    }}
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
                    value={isNaN(newEnvoice.total_envoice) ? '' : newEnvoice.total_envoice}
                    readOnly
                    placeholder="Total"
                />
                <input
                    type="text"
                    name="descripcion_envoice"
                    value={newEnvoice.descripcion_envoice}
                    onChange={handleInputChange}
                    placeholder="Descripción"
                />
                <ClientSelector
                    onSelectClient={(clientId, clientName) => {
                        setNewEnvoice(prevState => ({
                            ...prevState,
                            client_id: clientId,
                            nombre_envoice: clientName ? clientName : prevState.nombre_envoice // Update envoice name only if a client is selected
                        }));
                        setSelectedClientName(clientName);
                    }}
                />
                <ProductSelector
                    onAddProducts={handleAddProducts}
                    selectedProducts={newEnvoice.products.reduce((acc, product) => {
                        acc[product.id_product] = {
                            nombre_product: product.nombre_product,
                            quantity: product.quantity,
                            precio: product.precio
                        };
                        return acc;
                    }, {})}
                />
                <div className="selected-products-list">
                    <h4>Productos Seleccionados:</h4>
                    <ul>
                        {newEnvoice.products.map(product => (
                            <li key={product.id_product}>
                                <div className="selected-product-info">
                                    <span>{product.nombre_product}</span> - <span>{product.quantity}</span>
                                </div>
                                <button 
                                    type="button" 
                                    className="red-button" 
                                    onClick={() => handleRemoveProduct(product.id_product)}>
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit" className="red-button">Crear</button>
            </form>
        </div>
    );
};

export default EnvoiceCreateComponent;
