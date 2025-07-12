    const jwt = require("jsonwebtoken")
    const db = require("../db/db")

    // Middleware para verificar token JWT
    const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({ auth: false, message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY || "defaultSecretKey")
        req.userId = decoded.id
        next()
    } catch (error) {
        return res.status(401).json({ auth: false, message: "Invalid token" })
    }
    }

    // Middleware para verificar roles de administrador
    const verifyAdmin = async (req, res, next) => {
    try {
        const userId = req.userId

        const query = `
        SELECT usuarios.*, roles.nombre as rol_nombre 
        FROM usuarios 
        LEFT JOIN roles ON usuarios.rol_id = roles.id_rol 
        WHERE usuarios.id_usuario = ?
        `

        db.query(query, [userId], (error, results) => {
        if (error) {
            console.error("Error checking user role:", error)
            return res.status(500).json({ auth: false, message: "Error checking user role" })
        }

        if (results.length === 0) {
            return res.status(404).json({ auth: false, message: "User not found" })
        }

        const user = results[0]
        const roleName = user.rol_nombre?.toLowerCase()

        if (roleName === "administrador" || roleName === "dueño" || roleName === "admin") {
            req.user = user
            next()
        } else {
            return res.status(403).json({ auth: false, message: "Access denied. Admin role required." })
        }
        })
    } catch (error) {
        console.error("Error in verifyAdmin middleware:", error)
        return res.status(500).json({ auth: false, message: "Server error" })
    }
    }

    module.exports = {
    verifyToken,
    verifyAdmin,
    }
