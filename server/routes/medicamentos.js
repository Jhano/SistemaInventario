const express = require("express");
const Medicamento = require("../models/medicamentos");
const { verificaToken, verificaAdminRole } = require("../middlewares/authentication");


const app = express();

app.get("/medicamentos", [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Medicamento.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, medicamentos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Medicamento.countDocuments({ estado: true }, (err, countMedicamentos) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    medicamentos,
                    cuantos: countMedicamentos
                })
            })
        })
})

app.post("/medicamentos", [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let medicamento = new Medicamento({
        nombre: body.nombre,
        img: body.img,
        tipoMascota: body.tipoMascota,
        razaMascota: body.razaMascota,
        sizeMascota: body.sizeMascota,
        pesoMascota: body.pesoMascota,
        marca: body.marca,
        categoria: body.categoria,
        precio: body.precio
    });

    medicamento.save((err, medicamentoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            medicamento: medicamentoBD
        })
    })
})

app.put("/medicamentos/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Medicamento.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, medicamentoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            medicamentoBD
        })
    })
})

app.delete("/medicamentos/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }

    Medicamento.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, medicamentoStatus) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            medicamentoStatus
        })
    })
})

module.exports = app;