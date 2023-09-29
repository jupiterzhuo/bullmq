require('dotenv').config({path: '.env'})

const user = {
    username: process.env.USER || "jupiter.zhuo@travelio.com",
    password: process.env.PASSWORD || "123456",
}

const jwt = {
    secretKey: process.env.JWT_KEY || "4d734e4e-040a-11ed-b939-0242ac120002"
}

module.exports = {
    user,
    jwt
}