import React from 'react';
import '../Styles.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h3>Hofusushi</h3>
                <p>El alma del mar en cada bocado.</p>
                <div className="footer-contact">
                    <p>Creador de la página: Santiago Ciro Cornu</p>
                    <p>Teléfono: 2996101047</p>
                    <p>Email: <a href="mailto:santiagocirocornu@gmail.com">santiagocirocornu@gmail.com</a></p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Hofusushi. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
