const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcrypt");
const _ = require("underscore");

const app = express();

app.get("/usuarios", (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    Usuario.find({ estado: true }, "nombre email role estado google img") // filtra por estado: true, muestra los parametros entre """
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Usuario.count({ estado: true }, (err, countUsuarios) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: countUsuarios
                })
            })

        })

})



module.exports = app;