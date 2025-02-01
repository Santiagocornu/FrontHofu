import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../Styles.css';

const SalesComponent = () => {
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [searchDate, setSearchDate] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await axios.get('https://hofusushi-d77c0453ff79.herokuapp.com/api/sales');
            setSales(response.data);
            setFilteredSales(response.data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const calculateTotal = (sales) => {
        return sales.reduce((total, sale) => total + parseFloat(sale.monto_sale), 0);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchDate(value);

        const filtered = sales.filter(sale => sale.fecha_sale.includes(value));
        setFilteredSales(filtered);
    };

    const handleDeleteSaleAndEnvoice = async (id_sale, envoice_id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar!'
        });

        if (result.isConfirmed) {
            try {
                // Eliminar la venta
                await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/sales/${id_sale}`);

                // Eliminar la factura asociada
                await axios.delete(`https://hofusushi-d77c0453ff79.herokuapp.com/api/envoices/${envoice_id}`);

                Swal.fire({
                    icon: 'success',
                    title: 'Venta y factura eliminadas',
                    text: 'La venta y la factura asociada han sido eliminadas con éxito'
                });

                await fetchSales(); // Actualiza la lista de ventas desde el backend
            } catch (error) {
                console.error('Error eliminando la venta y la factura:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un problema eliminando la venta y la factura. Por favor intenta de nuevo.'
                });
            }
        }
    };

    return (
        <div className="sales-container">
            <h2>Ventas</h2>
            <input
                type="text"
                value={searchDate}
                onChange={handleSearchChange}
                placeholder="Buscar por fecha (Día/Mes/Año)"
                className="date-input"
            />
            <div className="total-bar">Total: {calculateTotal(filteredSales)}</div>
            <div className="table-container expanded-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                            <th>Envoice ID</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.map(sale => (
                            <tr key={sale.id_sale}>
                                <td>{sale.id_sale}</td>
                                <td>{sale.monto_sale}</td>
                                <td>{sale.fecha_sale}</td>
                                <td>{sale.envoice_id}</td>
                                <td>
                                    <button 
                                        className="red-button" 
                                        onClick={() => handleDeleteSaleAndEnvoice(sale.id_sale, sale.envoice_id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesComponent;
