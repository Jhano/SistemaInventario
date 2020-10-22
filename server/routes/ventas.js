const express = require("express");
const Venta = require("../models/ventas");
const { verificaToken, verificaAdminRole } = require("../middlewares/authentication");
const _ = require("underscore");



const app = express();

app.get("/ventas", [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Venta.find({ estado: true })
        .sort('fechaVenta') // los ordena por ese atributo
        .populate('usuario', 'nombre email')
        .populate('accesorio', 'nombre precio descripcion')
        .populate('medicamento', 'nombre precio descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, ventas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Venta.countDocuments({ estado: true }, (err, countVentas) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    ventas,
                    cuantos: countVentas
                })
            })
        })
})

app.get("/ventas/:id", [verificaToken], (req, res) => {
    let id = req.params.id;

    Venta.findById(id, (err, ventaBD) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!ventaBD) {
            res.status(500).json({
                ok: false,
                message: "El ID no existe",
                err

            })
        }

        res.json({
            ok: true,
            venta: ventaBD
        })
    })
})

app.get("/ventas/buscar/:termino", [verificaToken], (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //expresion regular para buscar; "i" significa que no respeta mayusculas ni minusculas

    Venta.find({ estado: true, fechaVenta: regex })
        .exec((err, ventaBD) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                venta: ventaBD
            })
        })

})

app.post("/ventas", [verificaToken], (req, res) => {
    let body = req.body;
    let usuario = req.usuario;

    let venta = new Venta({
        usuario: usuario._id,
        medicamento: body.medicamento,
        accesorio: body.accesorio,
        precio: body.precio,
    });

    Venta.save((err, ventaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            venta: ventaBD
        })
    })
})

app.put("/ventas/:id", [verificaToken], (req, res) => {
    let body = _.pick(req.body, ["medicamento", "accesorio", "precio", "fechaVenta"]);;
    let id = req.params.id;

    Venta.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, ventaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            ventaBD
        })
    })
})

app.delete("/ventas/:id", [verificaToken], (req, res) => {
    let id = req.params.id;


    Venta.findByIdAndRemove(id, { new: true, runValidators: true }, (err, ventaRemove) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            ventaRemove
        })
    })
})

module.exports = app;