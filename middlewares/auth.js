const jwt = require('jsonwebtoken')
const config = require('../config/auth')

module.exports = {
    checkTokenCookie: async (req, res, next) => {
        try {
            const token = req.cookies.bull_token
            if (!token) {
                return res.redirect('/login')
            }
            const verified = jwt.verify(token, config.jwt.secretKey)
            if (!verified) {
                return res.redirect('/login')
            }
            await next()
        } catch (error) {
            console.log(error)
            res.status(500).render("500")
        }
    },
    checkTokenHeader: async(req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send("Unauthorized")
            }
            if (!authHeader.includes("Bearer")) {
                return res.status(401).send("Unauthorized")
            }
            const tokenHeader = authHeader && authHeader.split(' ')[1];
            const verifiedHeader = jwt.verify(tokenHeader, config.jwt.secretKey)
            if (!verifiedHeader) {
                return res.status(403).send("Forbidden")
            }
            await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send("Internal Server Error")
        }
    }
}