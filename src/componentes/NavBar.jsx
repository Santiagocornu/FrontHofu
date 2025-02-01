import React from 'react';
import { Link } from 'react-router-dom';
import homeIcon from '../Fotos/d297a3eced48990f8001c8624ec84145.jpg'; // Importa la imagen para empleado
import casitaIcon from '../Fotos/b3ccd57b054a73af1a0d281265b54ec8.jpg'; // Importa la imagen para home
import '../Styles.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-ul">
        <li className="navbar-li">
          <Link to="/" className="navbar-link">
            <img src={casitaIcon} alt="Home" className="navbar-image" />
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/clientes" className="navbar-link navbar-white-button">
            Clientes
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/productos" className="navbar-link navbar-white-button">
            Productos
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/stock" className="navbar-link navbar-white-button">
            Stock
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/envoice" className="navbar-link navbar-white-button">
            Envoices
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/sales" className="navbar-link navbar-white-button">
            Ventas
          </Link>
        </li>
        <li className="navbar-li">
          <Link to="/empleado" className="navbar-link">
            <img src={homeIcon} alt="Empleado" className="navbar-image" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
