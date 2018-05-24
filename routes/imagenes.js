var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImage = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-image.png');
        res.sendFile(pathNoImagen);

    }

    // res.status(200).json({
    //     OK: true,
    //     mensaje: 'Peticion realizado correctamente'
    // })
});

module.exports = app;