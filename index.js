// CONFIGURAR LO QUE SERIA UN SERVIDOR CON LAS MINIMAS PRESTACIONES PARA CORRER EXPRESS
// Que este escuchando y tengamos una ruta principal "/" en el proyecto

require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
// en el cuerpo de la peticion viene un json, lo voy a transformar en un objeto JS y de esta manera
// lo voy a poder utilizar

// Router de Especialidades
const especialidadesRouter = require('./js/node/routers/especialidades.router');
app.use('/especialidades', especialidadesRouter);


// Router de Medicos
const medicosRouter = require('./js/node/routers/medicos.router');
app.use('/medicos', medicosRouter);
// Siempre que me refiera a peliculas le coloco el prefijo

// Router de Usuarios
const usuariosRouter = require('./js/node/routers/usuarios.router');
app.use('/usuarios', usuariosRouter);

/*// Router de Autentificacion
app.use("/auth", require("./js/node/routers/auth.router"));*/

// Router de Pacientes
const pacientesRouter = require('./js/node/routers/pacientes.router');
app.use('/pacientes', pacientesRouter);

// Router de Citas
const citasRouter = require('./js/node/routers/citas.router');
app.use('/citas', citasRouter);

// Router de Departamentos
const departamentosRouter = require('./js/node/routers/departamentos.router');
app.use('/departamentos', departamentosRouter);

// Router de Medicamentos
const medicamentosRouter = require('./js/node/routers/medicamentos.router');
app.use('/medicamentos', medicamentosRouter);

// Router de Historiales Medicos
const historialesMedicosRouter = require('./js/node/routers/historiales_medicos.router');
app.use('/historialesmedicos', historialesMedicosRouter);

// Router de Habitaciones
const habitacionesRouter = require('./js/node/routers/habitaciones.router');
app.use('/habitaciones', habitacionesRouter);

app.get("/", (req, res) => {
    res.send("Hola Hospital");
});
// Esta es la ruta principal del proyecto "/"

const PORT = process.env.PORT || 3088;
app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));
