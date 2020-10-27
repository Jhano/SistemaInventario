require("./config/config"); //Puerto

const express = require("express");
const app = express();
const bodyParser = require("body-parser"); //serializa lo que hay en x-www-form.urlencoded y lo transforma en un objeto json que es mas facil de utilizar
const mongoose = require("mongoose");
const cors = require("cors");

//enviar datos mediante aplication/x-www-form.urlencoded
app.use(bodyParser.urlencoded({ extended: false })); //cada peticion pasa por esta linea

//parsear a json => aplication/json
app.use(bodyParser.json());

//Solicitud de origen cruzado de bloqueo
app.use(cors());



//configuarion global de rutas
app.use(require("./routes/index"))

//conexion con mongodb
mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    (err, res) => {
        if (err) throw new Error(err);
        console.log("Base de datos Online")
    });

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto:", process.env.PORT);
})