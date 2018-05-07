var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        OK: true,
        mensaje: 'Peticion realizado correctamente'
    })
});

module.exports = app;