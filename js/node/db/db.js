const mysql = require("mysql2");

//// CONEXION A LA BBDD ////
const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "hospital-lifelline"
});

connection.connect((error) => {
    if(error){
        return console.error(error);
    }
    console.log("Estamos conectados a la Base de Datos - hospital-lifelline");
});

// EXPORTAR DEL MODULO LA FUNCION CONNECTION
module.exports = connection;
