require('dotenv').config({ path: `.env`});
const express = require('express');
const bodyParser = require("body-parser")
const app = express()
const cookieParser = require('cookie-parser')
require('events').EventEmitter.setMaxListeners(0);

const routes = require('../routes')

app.use(bodyParser.json({limit: '10mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.set('view engine', 'ejs')

routes.forEach(router => {
    app.use('/', router)
})

app.use(function(req, res) {
    const {
        originalUrl,
        method,
        path
    } = req
    try {
        decodeURIComponent(path)
    } catch (error) {
        res.status(404).render("404")
    }
});

module.exports = app