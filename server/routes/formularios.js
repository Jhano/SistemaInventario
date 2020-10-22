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
        .sort('nombreCliente') // los ordena por ese atributo
        .populate('idUsuario', 'nombre email') //busca una id o un idObject dentro de Formulario y el segundo paramatro filtra los datos que quiero mostrar
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

app.get("/formularios/:id", [verificaToken], (req, res) => {
    let id = req.params.id;

    Formulario.findById(id, (err, formularioBD) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!formularioBD) {
            res.status(500).json({
                ok: false,
                message: "El ID no existe",
                err

            })
        }

        res.json({
            ok: true,
            formulario: formularioBD
        })
    })
})

app.get("/formularios/buscar/:termino", [verificaToken], (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); //expresion regular para buscar; "i" significa que no respeta mayusculas ni minusculas

    Formulario.find({ estado: true, nombre: regex })
        .exec((err, formularioBD) => {
            if (err) {
                res.status(400).json({
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
        res.status(201).json({
            ok: true,
            formulario: formularioBD
        })
    })
})

app.put("/formularios/:id", [verificaToken], (req, res) => {
    let body = _.pick(req.body, ["nombreCliente", "tipoMascota", "fechaAgendada", "hora", "precio"]);;
    let id = req.params.id;

    Formulario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, formularioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: "El id ingresado no existe",
                err
            })
        }
        res.json({
            ok: true,
            formularioBD
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