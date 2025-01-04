import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './componentes/NavBar';
import Products from './componentes/Product/Product';
import Clients from './componentes/Client/Client';
import Home from './componentes/Home';
import Stock from './componentes/Stock/Stock';
import { EmployerProvider } from './EmployerContext';
import EmployerComponent from './componentes/Employer/EmployerComponent';
import EnvoiceManagementComponent from './componentes/Envoice/EnvoiceManagementComponent';

function App() {
  return (
    <div>
      <EmployerProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/empleado" element={<EmployerComponent />} />
          <Route path="/envoice" element={<EnvoiceManagementComponent/>} />
        </Routes>
      </Router>
      </EmployerProvider>
    </div>
  );
}

export default App;
