// Requires

var express = require('express');
var mongoose = require('mongoose');

//Inicializamos  variables

var app = express();


//conexion a la base de datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw (err);
    console.log('Base de Datos: \x1b[36m%s\x1b[0m', 'online');
});


// rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        OK: true,
        mensaje: 'Peticion realizado correctamente'
    })
});


// Escuchar peticiones

app.listen(3000, () => {
    console.log('Node/Express: \x1b[36m%s\x1b[0m', 'online');
});