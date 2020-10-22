const express = require("express");
const Formulario = require("../models/formularios");
const { verificaToken, verificaAdminRole } = require("../middlewares/authentication");
const _ = require("underscore");
const jwt = require("jsonwebtoken");


const app = express();

app.get("/formularios", [verificaToken], (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Formulario.find({ estado: true })
        .skip(desde)
        .limit(limite)
        .exec((err, formularios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Formulario.countDocuments({ estado: true }, (err, countFormularios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    formularios,
                    cuantos: countFormularios
                })
            })
        })
})

app.post("/formularios", [verificaToken], (req, res) => {
    let body = req.body;
    let usuario = req.usuario;

    let formulario = new Formulario({
        nombreCliente: body.nombreCliente,
        idUsuario: usuario._id,
        tipoMascota: body.tipoMascota,
        fechaAgendada: body.fechaAgendada,
        hora: body.hora,
        asunto: body.asunto,
        precio: body.precio,

    });

    formulario.save((err, formularioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            formulario: formularioBD
        })
    })
})

app.put("/formularios/:id", [verificaToken], (req, res) => {
    let body = _.pick(req.body, ["nombreCliente", "tipoMascota", "fechaAgendada", "hora", "precio"]);;
    let id = req.params.id;

    Formulario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, formularioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            formularioDB
        })
    })
})

app.delete("/formularios/:id", [verificaToken], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }

    Formulario.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, formularioStatus) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            formularioStatus
        })
    })
})

module.exports = app;