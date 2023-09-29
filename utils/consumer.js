const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { default: axios } = require('axios')
const consola = require('consola')
const config = require('../config/io-redis');

async function consumer(serviceName) {
    try {
        const connection = new IORedis(config.connection)
        const myWorker = new Worker(serviceName, async (job) => { 
            try {
                console.log('halo')
                // const body = Object.assign(job.data.data, { attemptsMade: job.attemptsMade })
                const { data } = await axios(job.data)
                await job.updateProgress(100)
                return data
            } catch (error) {
                throw error
            }
        }, { connection });
    
        myWorker.on('completed', (job) => consola.success(`${serviceName} completed ${job.id}`))
        myWorker.on('waiting', (job) => consola.info(`${serviceName} waiting ${job.id}`))
        myWorker.on('active', (job) => consola.info(`${serviceName} active ${job.id}`))
        myWorker.on('failed', (job) => consola.error(`${serviceName} failed ${job.id}`))
    } catch (error) {
        throw error
    }

}

module.exports = consumer;