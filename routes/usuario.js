var express = require('express');
var app = express();
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacacion');

// var SEED = require('../config/config').SEED;

// model de usuario
var Usuario = require('../models/usuario')

// =============================================
// Obtener todos los usuarios
// =============================================


app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: 'ERROR DE CARGA DE  USUARIO',
                        errors: err
                    });
                }

                res.status(200).json({
                    OK: true,
                    usuarios: usuarios
                });

            });


});




// =============================================
// Actualizar usuario
// =============================================

app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BUSCAR EL  USUARIO',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                OK: false,
                mensaje: 'EL  USUARIO CON EL ID ' + id + ' NO EXISTE',
                errors: { message: 'El usuario no existe' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: 'ERROR AL ACTULIZAR EL USUARIO',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                OK: true,
                usuario: usuarioGuardado
            });

        });

    });



});



// =============================================
// Crear usuario
// =============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    // Node.js body parsing middleware

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: 'ERROR AL CREAR EL  USUARIO',
                errors: err
            });
        }

        res.status(201).json({
            OK: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });


});

// =============================================
// Delete usuario
// =============================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: 'ERROR AL BORRAR EL  USUARIO',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                OK: false,
                mensaje: 'NO EXISTE  EL  USUARIO',
                errors: { message: 'NO EXISTE  EL  USUARIO' }
            });
        }

        res.status(201).json({
            OK: true,
            usuario: usuarioBorrado
        });

    });
});

module.exports = app;