const config = require('../config/auth')
const jwts = require('jsonwebtoken')

module.exports = {
    auth: async (username, password) => {
        try {
            if (config.user.username !== username || config.user.password !== password) {
                throw("Login Failed")
            }
            const jwt = jwts.sign({user: username}, config.jwt.secretKey)
            return { jwt }
        } catch (error) {
            console.log(error)
            throw error
        }
    } 
}