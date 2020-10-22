const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let ventasSchema = new Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: "usuario",
    },
    medicamento: {
        type: Schema.Types.ObjectId,
        ref: "medicamentos",
    },
    accesorio: {
        type: Schema.Types.ObjectId,
        ref: "accesorios",
    },
    fechaVenta: {
        type: Date,
        default: Date.now
    },
    precio: {
        type: Number,
        required: [true, "El precio de la venta es requerido"]
    }
})

ventasSchema.plugin(uniqueValidator, {
    message: "{PATH} debe ser unico"
});

module.exports = mongoose.model("ventas", ventasSchema);