const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let medicamentoSchema = new Schema({
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
    razaMascota: {
        type: String,
        required: false
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
    estado: {
        type: Boolean,
        default: true
    },
});

medicamentoSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser unico"
});

module.exports = mongoose.model("medicamentos", medicamentoSchema);