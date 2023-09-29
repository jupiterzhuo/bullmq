const { Queue } = require('bullmq')
const IORedis = require('ioredis');
const { setQueues, BullMQAdapter } = require('bull-board')
const producer = require('../utils/producer');
const consumer = require('../utils/consumer');
const IORdconfig = require('../config/io-redis');
const moment = require('moment');

async function getAllJobs() {
    try {
        const connection = new IORedis(IORdconfig.connection);
        const allKeys = await connection.keys("*")
        const allJobs = allKeys.filter((e) => e.includes(":id")).map((v) => v.replace("bull:", "").replace(":id", ""))
        return allJobs
    } catch (error) {
        throw error
    }
}

const connection = new IORedis(IORdconfig.connection);

module.exports = {
    create: async (data) => {
       
        try {
            await producer(data.queue_name, data.job_name, data.data, data.is_repeatable, data.delay, false, data.attempt)
            await consumer(data.queue_name)
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    bulkCreate: async (data) => {
        try {
            await producer(data.queue_name, '', data.data, false, 0, true, 3)
            await consumer(data.queue_name)
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    obliterate: async (data) => {
        try {
            const queue = new Queue(data.queue_name, { connection });
            await queue.obliterate();
            return "success"
        } catch (error) {
            throw error
        }
    },
    reInsertQueue: async () => {
        try {
            const filtered = await getAllJobs()
            for (let i = 0; i < filtered.length; i++) {
                const single = []
                const el = filtered[i];
                const myQueue = new Queue(el, { connection });
                const jobs = await myQueue.getJobs(['active', 'delayed', 'waiting', 'repeat'])
                if (jobs.length > 0) {
                    for (let j = 0; j < jobs.length; j++) {
                        const e = jobs[j];
                        if (e) {
                            if (e.opts.repeat) {
                                await producer(el, e.name, e.data, true, 0)
                                await consumer(el)
                            } else {
                                single.push({ name: e.name, data: e.data })
                            }
                        }
                    }
                }
                if (single.length > 0) {
                    await producer(el, '', single, false, 0, true)
                    await consumer(el)
                }
                setQueues([ new BullMQAdapter(myQueue) ])
            }
            return "success"
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    removeOldJobs: async () => {
        try {
            const allJobs = await getAllJobs()
            const allJobsByDate = allJobs
            .map((v) => v.split(':')
            .slice(2, v.split(':').length - 1).join(':'))
            .filter((v) => v.length > 0)
            .filter((v) => new Date(v) < moment(new Date()).subtract(3, 'days').endOf('day'))
            .sort((a ,b) => new Date(a) - new Date(b))
            const obsoleteJobs = allJobs.map((v) => allJobsByDate.find((e) => v.includes(e)) ? v : null).filter((e) => e !== null)
            for (let i = 0; i < obsoleteJobs.length; i++) {
                const el = obsoleteJobs[i];
                const queue = new Queue(el, { connection });
                await queue.obliterate();
                await connection.del(el)
            }
            return "success"
        } catch (error) {
            throw error
        }
    },
    getjobs: async (job_name,queue_name) => {
        try {
            console.log({job_name})
            const myQueue = new Queue(queue_name, { connection });
            const jobs = await myQueue.getJobs(['completed','failed','waiting','active'], 0, 500, true);
            if (job_name) {
                const job=jobs.find((e)=>{
                    return e.name===job_name
                })
                console.log(job)
                return job
            }
            // return jobs.map((e)=>{
            //     return {
            //         name:e.name,
            //         failed:!!e.failedReason
            //     }
            // })
        }catch (error) {
            throw error
        }
    }
}