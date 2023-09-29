module.exports = {
    login: (_req, res) => res.render("login", {error: false, username: "", password: ""}),
    home: async (req, res) => res.render('home', { isLoggedIn: req.cookies.bull_token })
}