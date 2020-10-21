const express = require("express");
const Accesorio = require("../models/accesorios");
const { verificaToken, verificaAdminRole } = require("../middlewares/authentication");


const app = express();

app.get("/accesorios", [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Accesorio.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, accesorios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Accesorio.countDocuments({ estado: true }, (err, countAccesorios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    accesorios,
                    cuantos: countAccesorios
                })
            })
        })
})

app.post("/accesorios", [verificaToken], (req, res) => {
    let body = req.body;

    let accesorio = new Accesorio({
        nombre: body.nombre,
        img: body.img,
        tipoMascota: body.tipoMascota,
        sizeMascota: body.sizeMascota,
        pesoMascota: body.pesoMascota,
        marca: body.marca,
        categoria: body.categoria,
        precio: body.precio
    });

    accesorio.save((err, accesorioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            accesorio: accesorioBD
        })
    })
})

app.put("/accesorios/:id", [verificaToken], (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Accesorio.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, accesorioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            accesorioBD
        })
    })
})

app.delete("/accesorios/:id", [verificaToken], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }

    Accesorio.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, accesorioStatus) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            accesorioStatus
        })
    })
})

module.exports = app;