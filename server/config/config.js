//==================
//PUERTO
//==================
process.env.PORT = process.env.PORT || 3000;


//==================
//Enterno
//==================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//==================
//Vencimiento del Token
//==================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//==================
//SEED de autentificacion
//==================
process.env.SEED = process.env.SEED || "secret-seed-desarrollo"

//==================
//Base de datos
//==================
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb://localhost:27017/Kuyen"
} else {
    urlDB = process.env.MONGODB_URI;
}



process.env.urlDB = urlDB;


//==================
//Google CLient ID
//==================
process.env.CLIENT_ID = process.env.CLIENT_ID || "397255333013-4mqndh7dkaf62kg45d7m5lto2inf2hg5.apps.googleusercontent.com"