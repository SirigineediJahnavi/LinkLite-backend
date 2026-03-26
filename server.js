const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");

const app = express();

app.use(cors());
app.use(express.json());

// Helmet CSP to allow fonts, scripts, and styles
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://linklite-backend-jahnavi.onrender.com"
      ],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      scriptSrc: [
        "'self'",
        "https://linklite-backend-jahnavi.onrender.com"
      ],
      connectSrc: [
        "'self'",
        "https://linklite-backend-jahnavi.onrender.com"
      ]
    }
  })
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("db connected"))
  .catch((err) => console.error("db connection error:", err));

const urlRoutes = require("./routes/url");
app.use("/", urlRoutes);

const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const c = require("./config/redis");

app.use(rateLimit({
  store: new RedisStore({
    sendCommand: (...a) => c.sendCommand(a)
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on ${port}`));