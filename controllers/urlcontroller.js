const Url=require("../models/url")
const {nanoid}=require("nanoid")
const r=require("../config/redis")
const QRCode=require("qrcode")

exports.shorten = async (req, res) => {
  try {
    const { url } = req.body
    if (!url) return res.status(400).json({ msg: "url required" })

    let id, u

    while (true) {
      id = nanoid(6)
      try {
        u = await Url.create({ o: url, s: id })
        break
      } catch (e) {
        if (e.code !== 11000) throw e
      }
    }

    const short = `https://linklite-backend-jahnavi.onrender.com/${id}`

    await r.set(id, url)

    const qr = await QRCode.toDataURL(short)

    res.json({ short, qr })
  } catch (e) {
    console.log(e)  // <-- Add this to see the real error in Render logs
    res.status(500).json({ msg: "error" })
  }
}

exports.redirect=async(req,res)=>{
  const {id}=req.params

  const cached=await r.get(id)
  if(cached){
    await Url.updateOne({s:id},{$push:{clicks:{t:new Date()}}})
    return res.redirect(cached)
  }

  const data=await Url.findOne({s:id})
  if(!data) return res.status(404).json({msg:"not found"})

  await r.set(id,data.o,{EX:3600})
  await Url.updateOne({s:id},{$push:{clicks:{t:new Date()}}})

  data.c++
  await data.save()

  res.redirect(data.o)
}

exports.analytics=async(req,res)=>{
  const {id}=req.params
  const data=await Url.findOne({s:id})
  if(!data) return res.status(404).send("not found")
  res.json({clicks: data.clicks})
}
