require('dotenv').config({ path: `.env`});
const http = require('http');
const port = process.env.PORT || 3001
const app = require('./app')
const queueService = require('../services/queue')

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`server is running on port ${port}`)
    // queueService.reInsertQueue()
})