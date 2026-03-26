const { createClient } = require("redis")

const c = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false
  }
})

c.connect()

module.exports = c