const mysql = require("mysql2");

//mysql://root:NRidEGmvzsDOxKmBzPiogDWoWuGTLwsp@yamabiko.proxy.rlwy.net:14027/railway
//// CONEXION A LA BBDD ////
const connection = mysql.createConnection({
    host : process.env.HOSTDB || "localhost",
    user : process.env.USERDB || "root",
    password : process.env.PASSWORDDB || "",
    database : process.env.DB || "hospital-lifelline",
    port: process.env.PORTDB || 3088
});

connection.connect((error) => {
    if(error){
        return console.error(error);
    }
    console.log("Estamos conectados a la Base de Datos - hospital-lifelline");
});

// EXPORTAR DEL MODULO LA FUNCION CONNECTION
module.exports = connection;
