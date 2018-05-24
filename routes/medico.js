var express = require('express');
var app = express();


var mdAutenticacion = require('../middlewares/autenticacacion');

// var SEED = require('../config/config').SEED;

// model de medico
var Medico = require('../models/medico')

// =============================================
// Obtener todos los medicos
// =============================================


app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: 'ERROR DE CARGA DE  HOSPITAL',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {

                    res.status(200).json({
                        OK: true,
                        medicos: medicos,
                        total: conteo
                    });
                })


            });


});




// =============================================
// Actualizar medico
// =============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BUSCAR EL  HOSPITAL',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                OK: false,
                mensaje: 'EL  HOSPITAL CON EL ID ' + id + ' NO EXISTE',
                errors: { message: 'El HOSPITAL no existe' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;


        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: 'ERROR AL ACTUALIZAR EL HOSPITAL',
                    errors: err
                });
            }

            res.status(200).json({
                OK: true,
                medico: medicoGuardado
            });

        });

    });



});



// =============================================
// Crear medico
// =============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    // Node.js body parsing middleware

    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: 'ERROR AL CREAR EL  HOSPITAL',
                errors: err
            });
        }

        res.status(201).json({
            OK: true,
            medico: medicoGuardado

        });

    });


});

// =============================================
// Delete medico
// =============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BORRAR EL  USUARIO',
                errors: err
            });
        }
        if (!medicoBorrado) {
            return res.status(400).json({
                OK: false,
                mensaje: 'NO EXISTE  EL  HOSPITAL',
                errors: { message: 'NO EXISTE  EL  HOSPITAL' }
            });
        }

        res.status(201).json({
            OK: true,
            medico: medicoBorrado
        });

    });
});

module.exports = app;