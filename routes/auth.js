const express = require('express')
const app = express()
const authController = require('../controllers/auth')

app.post('/login', authController.login)
app.post('/login/local', authController.loginLocal)

module.exports = app