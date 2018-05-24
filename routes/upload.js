var express = require('express');
var app = express();

var fileUpload = require('express-fileupload');
var fs = require('fs');

// models
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipo de colecciones

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // obtener el nombre de la imagen 
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];



    //extensiones de archivos aceptadas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            OK: false,
            mensaje: 'extension  validas',
            errors: { mensaje: 'Las Extensiones validas son ' + extensionesValidas.join(', ') }
        });
    }


    // Nombre de archivo personalizado


    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    //Mover el archivo temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        // res.status(200).json({
        //     OK: true,
        //     mensaje: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });


    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {



    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    OK: true,
                    mensaje: 'usuario no existe',
                    usuario: { message: 'usuario no existe' }
                });

            }
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)

            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                medicoActualizado.password = ':)';

                res.status(200).json({
                    OK: true,
                    mensaje: 'Imagen de usuario actulizado',
                    usuario: usuarioActualizado
                });


            });

        });

    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    OK: true,
                    mensaje: 'medico no existe',
                    medico: { message: 'medico no existe' }
                });

            }
            var pathViejo = './uploads/medicos/' + medico.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)

            }
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                res.status(200).json({
                    OK: true,
                    mensaje: 'Imagen de medico actulizado',
                    medico: medicoActualizado
                });


            });

        });

    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    OK: true,
                    mensaje: 'hospital no existe',
                    hospital: { message: 'hospital no existe' }
                });

            }
            var pathViejo = './uploads/hospitales/' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo)

            }
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {
                res.status(200).json({
                    OK: true,
                    mensaje: 'Imagen de hospital  actualizado',
                    hospital: hospitalActualizado
                });


            });

        });

    }

}

module.exports = app;