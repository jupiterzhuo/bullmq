const authService = require('../services/auth')

module.exports = {
    login: async(req, res) => {
        const { body: { username, password } } = req;
        try {
            const auth = await authService.auth(username, password)
            if (auth.jwt) {
                return res.cookie('bull_token', auth.jwt).redirect('/dashboard')
            }
            return res.render("login", {error: true, username, password})
        } catch (error) {
            console.log(error)
            if (error === 'Login Failed') {
                return res.render("login", {error: true, username, password})
            }
            return res.status(500).render("500")
        }
    },
    loginLocal: async(req, res) => {
        const { body: { username, password } } = req;
        try {
            const auth = await authService.auth(username, password)
            if (auth.jwt) {
                return res.send({jwt: auth.jwt})
            }
        } catch (error) {
            console.log(error)
            if (error === 'Login Failed') {
                return res.status(401).send("Login Failed")
            }
            return res.status(500).send("Internal Server Error")
        }
    },
}