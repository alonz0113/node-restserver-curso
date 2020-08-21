const express = require('express');
const _ = require('underscore');


const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');


const app = express();


// =========================
//  Obtener productos
// =========================
app.get('/producto', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria <= que se muestre
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    producto,
                    cuantos: conteo
                });
            });
        });
});


// =========================
//  Obtener producto por ID
// =========================
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario categoria
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (!producto) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: `El ID ${id} no es correcto`
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
                productoDB
            });
        });
});
// =========================
//  Buscar productos
// =========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // RegExp es una funcion de de JS, se pone una 'i' para que sea insensible a may y min

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });

});



// =========================
//  Crear un nuevo producto
// =========================
app.post('/producto', verificaToken, async(req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let usuarioCrea = req.usuario._id;
    let body = req.body;

    Categoria.findById(body.categoria, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `La categoria ${body.categoria} no existe`
                }
            });
        }

        let producto = new Producto({
            nombre: body.nombre,
            precioUni: body.precio,
            descripcion: body.descripcion,
            categoria: body.categoria,
            usuario: usuarioCrea
        });

        producto.save((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });

        });
    });

});


// =========================
//  Actualizar producto
// =========================
app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria']);

    console.log(id, req.body, body);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: false }, (err, precioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            precio: precioDB
        });
    });


});


// =========================
//  Borrar un producto
// =========================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado
    // fisicamente sigue existiendo en disponible debe ser false
    // decir que ya no hay disponible

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    })


});

module.exports = app;