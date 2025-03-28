const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todas las rutas a index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Cambios clave para aceptar conexiones externas
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Permitir acceso desde cualquier IP en la red

app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));