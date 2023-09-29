require('express-group-routes')
const express = require('express')
const app = express()
const queueController = require('../controllers/queue');
const checkToken = require('../middlewares/auth')

app.post('/queue', checkToken.checkTokenHeader, queueController.create)
app.post('/queue/bulk', checkToken.checkTokenHeader, queueController.bulkCreate)
app.delete('/queue', checkToken.checkTokenHeader, queueController.obliterate)
app.get('/all-keys', checkToken.checkTokenHeader, queueController.allKeys)
app.get('/remove-old-jobs', checkToken.checkTokenHeader, queueController.allKeysBulk)
app.post('/get-jobs', checkToken.checkTokenHeader, queueController.getjobs)

module.exports = app