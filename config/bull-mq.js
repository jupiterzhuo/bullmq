function options(attempts = 3) {
    return {
        lifo: true, 
        removeOnComplete: 1000, 
        removeOnFail: 1000, 
        attempts,
        backoff: {
            type: 'exponential',
            delay: 3000
        }
    }
}

module.exports = { options }