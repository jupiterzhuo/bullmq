const { Queue, QueueScheduler } = require("bullmq")
const IORedis = require('ioredis');
const { setQueues, BullMQAdapter } = require('bull-board')
const IORdconfig = require('../config/io-redis');
const BullMqconfig = require('../config/bull-mq');

async function producer(queueName, jobName='', data, isRepeatable=false, delay=0, isBulk=false, attempt=3){ 
    try {
        const connection = new IORedis(IORdconfig.connection);
        if (isRepeatable) {
            const myQueueScheduler = new QueueScheduler(queueName.toString(), { connection });
            const myQueue = new Queue(queueName.toString(), { connection });
            setQueues([ new BullMQAdapter(myQueue) ])
            if (isBulk) {
                await myQueue.addBulk(data.map((v) => ({...v, opts: { ...BullMqconfig.options(attempt) }})))
            } else {
                await myQueue.add(jobName, data, {...BullMqconfig.options(attempt), repeat: { cron: "1 0 * * *" }})
            }
        } else {
            const myQueueScheduler = new QueueScheduler(queueName.toString(), { connection });
            const myQueue = new Queue(queueName.toString(), { connection });
            setQueues([ new BullMQAdapter(myQueue) ])
            if (isBulk) {
                await myQueue.addBulk(data.map((v) => ({...v, opts: { ...BullMqconfig.options(attempt), delay }})))
            } else {
                await myQueue.add(jobName, data, {...BullMqconfig.options(attempt), delay })
            }
        }
        return
    } catch (error) {
        throw error
    }
}

module.exports = producer
