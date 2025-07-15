    // CONFIGURAR LO QUE SERIA UN SERVIDOR CON LAS MINIMAS PRESTACIONES PARA CORRER EXPRESS
    // Que este escuchando y tengamos una ruta principal "/" en el proyecto

    require("dotenv").config()

    const express = require("express")
    const path = require("path")
    const cookieParser = require("cookie-parser")
    const app = express()

    app.use(express.json())
    app.use(cookieParser()) // Para manejar cookies
    // en el cuerpo de la peticion viene un json, lo voy a transformar en un objeto JS y de esta manera
    // lo voy a poder utilizar

    // Router de Especialidades
    const especialidadesRouter = require("./js/node/routers/especialidades.router")
    app.use("/especialidades", especialidadesRouter)

    // Router de Medicos
    const medicosRouter = require("./js/node/routers/medicos.router")
    app.use("/medicos", medicosRouter)
    // Siempre que me refiera a peliculas le coloco el prefijo

    // Router de Usuarios
    const usuariosRouter = require("./js/node/routers/usuarios.router")
    app.use("/usuarios", usuariosRouter)

    // Router de Autentificacion
    const authRouter = require("./js/node/routers/auth.router")
    app.use("/auth", authRouter) // /registro

    // Router de Citas
    const turnosRouter = require("./js/node/routers/turnos.router")
    app.use("/turnos", turnosRouter)

    // Router de obra social
    const obrasocialsRouter = require("./js/node/routers/obras_sociales.router")
    app.use("/obrasocial", obrasocialsRouter)

    // Router de Historiales Medicos
    const historialesMedicosRouter = require("./js/node/routers/historiales_medicos.router")
    app.use("/historialesmedicos", historialesMedicosRouter)

    // Router de Habitaciones
    const habitacionesRouter = require("./js/node/routers/habitaciones.router")
    app.use("/habitaciones", habitacionesRouter)

    // Router de Hospital
    const hospitalRouter = require("./js/node/routers/hospital.router")
    app.use("/hospital", hospitalRouter)

    // Router de Roles
    const rolesRouter = require("./js/node/routers/roles.router")
    app.use("/roles", rolesRouter)

    /* // Router de Comprobantes --> En carpeta de prueba
    const comprobantesRouter = require("./js/node/routers/comprobantes.router")
    app.use("/comprobantes", comprobantesRouter) */

    // Router de Turnos con Comprobante
    const turnosComprobanteRouter = require("./js/node/routers/turnos-comprobante.router")
    app.use("/turnos-comprobante", turnosComprobanteRouter)

    // Router de Contacto
    const contactoRouter = require("./js/node/routers/contacto.router")
    app.use("/contacto", contactoRouter)

    // Middleware para proteger rutas de administrador
    const { verifyToken, verifyAdmin } = require("./js/node/middleware/auth.middleware")

    // Servir archivos estáticos desde la carpeta PAGES
    app.use(express.static(path.resolve(__dirname)))

    // Ruta principal del proyecto
    app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages", "Home.html"))
    })

    // Ruta de contacto (protegida - se verifica en el frontend)
    app.get("/contacto", (req, res) => {
        res.sendFile(path.resolve(__dirname, "pages", "contacto.html"))
    })

        // Ruta de servicios
    app.get("/servicios", (req, res) => {
        res.sendFile(path.resolve(__dirname, "pages", "servicios.html"))
    })

    // Ruta de acerca de 
    app.get("/acerca-de", (req, res) => {
        res.sendFile(path.resolve(__dirname, "pages", "acerca-de.html"))
    })
    // Ruta de turnos (la protección se maneja en el frontend)
    app.get("/turnos-fron", (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages", "Turno.html"))
    })

    app.get("/login-register", (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages", "Login_Register.html"))
    })

    // Ruta de admin (protegida - requiere rol de administrador)
    app.get("/admin", verifyToken, verifyAdmin, (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages", "admin", "Admin.html"))
    })

    // Ruta comodín para servir cualquier archivo HTML desde la carpeta PAGES
    app.get("/:page", (req, res) => {
    const filePath = path.resolve(__dirname, "pages", req.params.page + ".html")
    res.sendFile(filePath, (err) => {
        if (err) {
        res.status(404).send("Página no encontrada")
        }
    })
    })

    const PORT = process.env.PORT || 3306
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
