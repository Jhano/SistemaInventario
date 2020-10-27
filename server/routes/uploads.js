const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Medicamento = require('../models/medicamentos');
const Accesorio = require('../models/accesorios');

const fs = require('fs'); //file system
const path = require('path');

app.use(fileUpload({
    useTempFiles: true
}));



app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }

        })
    }

    //Validar tipo
    let tiposValidos = ['accesorios', 'medicamentos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        })
    }

    //extemsion de archivos
    let archivo = req.files.archivo;
    let nombreCortada = archivo.name.split('.');
    let extension = nombreCortada[nombreCortada.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //cambio nombre archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case 'accesorios':
                imagenAccesorio(id, res, nombreArchivo);
                break;
            case 'medicamentos':
                imagenMedicamento(id, res, nombreArchivo);
                break;
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
        }

    })
})

let imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })
}


let imagenAccesorio = (id, res, nombreArchivo) => {
    Accesorio.findById(id, (err, accesorioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'accesorios');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!accesorioDB) {
            borraArchivo(nombreArchivo, 'accesorios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Accesorio no existe'
                }
            })
        }


        borraArchivo(accesorioDB.img, 'accesorios');

        accesorioDB.img = nombreArchivo;

        accesorioDB.save((err, accesorioGuardado) => {
            res.json({
                ok: true,
                accesorio: accesorioGuardado,
                img: nombreArchivo
            })
        })

    })
}

let imagenMedicamento = (id, res, nombreArchivo) => {
    Medicamento.findById(id, (err, medicamentoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'medicamentos');
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!medicamentoDB) {
            borraArchivo(nombreArchivo, 'medicamentos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Medicamento no existe'
                }
            })
        }

        borraArchivo(medicamentoDB.img, 'medicamentos');

        medicamentoDB.img = nombreArchivo;

        medicamentoDB.save((err, medicamentoGuardado) => {
            res.json({
                ok: true,
                medicamento: medicamentoGuardado,
                img: nombreArchivo
            })
        })

    })
}

let borraArchivo = (nombreImagen, tipo) => {
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`) //creando un path
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;