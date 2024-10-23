// CONFIGURAR LO QUE SERIA UN SERVIDOR CON LAS MINIMAS PRESTACIONES PARA CORRER EXPRESS
// Que este escuchando y tengamos una ruta principal "/" en el proyecto

require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
// en el cuerpo de la peticion viene un json, lo voy a transformar en un objeto JS y de esta manera
// lo voy a poder utilizar

// Router de Profesiones
const profesionesRouter = require('./js/node/routers/profesiones.router');
app.use('/profesiones', profesionesRouter);


// Router de Medicos
const medicosRouter = require('./js/node/routers/medicos.router');
app.use('/medicos', medicosRouter);
// Siempre que me refiera a peliculas le coloco el prefijo

// Router de Usuarios
const usuariosRouter = require('./js/node/routers/usuarios.router');
app.use('/usuarios', usuariosRouter);

// Router de Autentificacion
app.use("/auth", require("./routers/auth.router"));

app.get("/", (req, res) => {
    res.send("Hola Hospital");
});
// Esta es la ruta principal del proyecto "/"

const PORT = process.env.PORT || 3088;
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));
