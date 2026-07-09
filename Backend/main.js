require("dotenv/config");
const express = require("express");
const cors = require("cors");
const startDb = require("./config/db.js"); 
const usersRouter = require("./modules/users/usersRoute.js");
const authRouter = require("./modules/auth/authRoute.js");
const errorHandler = require("./middlewares/errorHandler.js");

const server = express();
const PORT = process.env.PORT;

server.use(express.json()); 
server.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        process.env.CLIENT_URL,
        "https://flowbix-6j94nb7el-anna25.vercel.app"
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


// Rotta di test iniziale per verificare il funzionamento
server.get("/", (req, res) => {
  res.send("API di FlowBix funzionanti al 100%!");
});

server.use("/users", usersRouter);
server.use("/auth", authRouter);

server.use(errorHandler);

startDb(PORT, server);