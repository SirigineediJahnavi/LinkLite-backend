const {createClient}=require("redis")

const r=createClient({url:process.env.REDIS_URL})
r.connect()

module.exports=r