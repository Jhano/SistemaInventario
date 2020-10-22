const express = require("express");
const Usuario = require("../models/usuario");
const { verificaToken, verificaAdminRole } = require("../middlewares/authentication");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();

app.get("/usuarios", verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, "nombre email role estado google img") // filtra por estado: true, muestra los parametros entre ""
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.countDocuments({ estado: true }, (err, countUsuarios) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: countUsuarios
                })


            })

        })
})

app.post("/usuarios", [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


app.put("/usuarios/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: "El id ingresado no existe"
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.delete("/usuarios/:id", [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false,
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, usuarioStatus) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                message: "El id ingresado no existe"
            })
        }
        res.json({
            ok: true,
            usuarios: usuarioStatus
        })
    })

})


module.exports = app;