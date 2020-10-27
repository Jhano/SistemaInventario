const jwt = require("jsonwebtoken");

let verificaToken = (req, res, next) => {
    let token = req.get("token"); //obteniendo token de los headers

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })


}

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.json({
            ok: false,
            message: "Rol sin autorización"
        })
    }
}

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; //obteniendo token de la url

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario;
        next();
    })


}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}