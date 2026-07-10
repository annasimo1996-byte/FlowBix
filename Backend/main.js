require("dotenv/config");
const express = require("express");
const cors = require("cors");
const startDb = require("./config/db.js");
const usersRoute = require("./modules/users/usersRoute.js");
const authRoute = require("./modules/auth/authRoute.js");
const errorHandler = require("./middlewares/errorHandler.js");
const clientsRoute = require("./modules/clients/clientsRoute.js")
const server = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "https://flowbix.vercel.app",
  process.env.CLIENT_URL,
];

server.use(express.json());
server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// Rotta di test iniziale per verificare il funzionamento
server.get("/", (req, res) => {
  res.send("API di FlowBix funzionanti al 100%!");
});

server.use("/users", usersRoute);
server.use("/clients", clientsRoute)
server.use("/auth", authRoute);

server.use(errorHandler);

startDb(PORT, server);