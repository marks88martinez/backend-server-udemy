var express = require('express');
var app = express();


var mdAutenticacion = require('../middlewares/autenticacacion');

// var SEED = require('../config/config').SEED;

// model de hospital
var Hospital = require('../models/hospital')

// =============================================
// Obtener todos los hospitales
// =============================================


app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: 'ERROR DE CARGA DE  HOSPITAL',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        OK: true,
                        hospitales: hospitales,
                        total: conteo

                    });

                })
            });


});




// =============================================
// Actualizar hospital
// =============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BUSCAR EL  HOSPITAL',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                OK: false,
                mensaje: 'EL  HOSPITAL CON EL ID ' + id + ' NO EXISTE',
                errors: { message: 'El HOSPITAL no existe' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;


        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: 'ERROR AL ACTUALIZAR EL HOSPITAL',
                    errors: err
                });
            }

            res.status(200).json({
                OK: true,
                hospital: hospitalGuardado
            });

        });

    });



});



// =============================================
// Crear hospital
// =============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    // Node.js body parsing middleware

    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: 'ERROR AL CREAR EL  HOSPITAL',
                errors: err
            });
        }

        res.status(201).json({
            OK: true,
            hospital: hospitalGuardado

        });

    });


});

// =============================================
// Delete hospital
// =============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BORRAR EL  USUARIO',
                errors: err
            });
        }
        if (!hospitalBorrado) {
            return res.status(400).json({
                OK: false,
                mensaje: 'NO EXISTE  EL  HOSPITAL',
                errors: { message: 'NO EXISTE  EL  HOSPITAL' }
            });
        }

        res.status(201).json({
            OK: true,
            hospital: hospitalBorrado
        });

    });
});

module.exports = app;