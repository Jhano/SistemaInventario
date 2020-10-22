const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let formSchema = new Schema({
    idUsuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
    },
    nombreCliente: {
        type: String,
        required: [true, "El nombre del cliente es necesario"]
    },
    tipoMascota: {
        type: String,
        required: [true, "El tipo de mascota es necesario"]
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaAgendada: {
        type: String,
        required: [true, "La fecha agendada es necesaria"]
    },
    hora: {
        type: String,
        required: false
    },
    asunto: {
        type: String,
        required: [true, "El asunto es necesario"]
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

formSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser unico"
});

module.exports = mongoose.model("formulario", formSchema);