require('dotenv').config({path: '.env'})

const connection = {
    host: process.env.REDIS_HOST || 'cache',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: null
}

module.exports = {
    connection
}