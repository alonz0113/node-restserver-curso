const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');


// ============================
// Mostrar todas las categorias
// ============================
app.get('/categoria', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('nombre') // Sirve para ordenar los datos que pido de acuerdo a lo que ponga en el paretesis 
        .populate('usuario', 'nombre email') // funcion para conectar la tabla usuario con la tabla categoria
        // despues de la coma se pone los valores que quiero traer
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});


// ============================
// Mostrar una categoria por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // Categoria.findById(....);

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {


        if (!categoria) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: 'El ID no es correcto'
                }
            });
        }

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria
        });

    });
});


// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', verificaToken, (req, res) => {

    let usuarioCrea = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: usuarioCrea
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

    //regresa la nueva categoria
    //req.usuario._id
});


// ============================
// Actualizar la categoria
// ============================
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, 'nombre');

    Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// ============================
// Borrar la categoria
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });


    });
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove
});



module.exports = app;