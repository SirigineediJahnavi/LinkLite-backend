const express=require("express")
const r=express.Router()
const c=require("../controllers/urlcontroller")

r.post("/shorten",c.shorten)
r.get("/:id",c.redirect)
r.get("/analytics/:id",c.analytics)

module.exports=r