const queueService = require('../services/queue');

module.exports = {
    create: async (req, res) => {
        try {
            const { body } = req;
            await queueService.create(body)
            res.send("success")
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
    bulkCreate: async (req, res) => {
        try {
            const { body } = req;
            await queueService.bulkCreate(body)
            res.send("success")
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
    obliterate: async (req, res) => {
        try {
            const { body } = req;
            await queueService.obliterate(body)
            res.send("success")
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
    allKeys: async (_req, res) => {
        try {
            const allKeys = await queueService.reInsertQueue()
            res.send(allKeys)
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
    allKeysBulk: async (_req, res) => {
        try {
            const allKeys = await queueService.removeOldJobs()
            res.send(allKeys)
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
    getjobs: async (req, res) => {
        try {
            const { body } = req;
            const alljobs = await queueService.getjobs(body.job_name, body.queue_name)
            res.send(alljobs)
        } catch (error) {
            console.log(error)
            res.status(500).send("Internal Server Error")
        }
    },
}