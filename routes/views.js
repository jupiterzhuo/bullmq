const express = require('express')
const app = express()
const viewsController = require('../controllers/views')
const checkToken = require('../middlewares/auth')
const { router } = require('bull-board')

app.get('/', viewsController.home)
app.get('/login', viewsController.login)
app.use('/dashboard', checkToken.checkTokenCookie, router)

module.exports = app