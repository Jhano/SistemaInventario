const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let accesorioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    img: {
        type: String,
        require: false
    },
    tipoMascota: {
        type: String,
        required: [true, "El tipo de mascota es necesario"]
    },
    sizeMascota: {
        type: String,
        required: false
    },
    pesoMascota: {
        type: Number,
        required: false

    },
    marca: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        required: false
    },
    precio: {
        type: Number,
        required: [true, "El precio es necesario"]
    },
    descripcion: {
        type: String,
        required: false
    },
    estado: {
        type: Boolean,
        default: true
    },
});

accesorioSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser unico"
});

module.exports = mongoose.model("accesorios", accesorioSchema);