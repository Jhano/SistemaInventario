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
process.env.SEED = process.env.SEED || "secret-seed-desarrollo" //creo que esto es solo para heruko, revisar despuesssss

//==================
//Base de datos
//==================
let urlDB;

if (process.env.NODE_ENV === "dev") {
    urlDB = "mongodb+srv://Kuyen:ZTCOMzqEj1oHTrAw@sistemainventario.ziuaw.mongodb.net/Kuyen?retryWrites=true&w=majority"
} else {
    urlDB = process.env.MONGO_URL;
}


process.env.urlDB = urlDB;