const { createClient } = require("redis")

const c = createClient({
  url: process.env.REDIS_URL
})

c.connect()

module.exports = c