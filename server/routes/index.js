const express = require("express");
const app = express();

app.use(require("./usuario"));
app.use(require("./login"));
app.use(require("./medicamentos"));
app.use(require("./accesorios"));
app.use(require("./formularios"));
app.use(require("./ventas"));

module.exports = app;