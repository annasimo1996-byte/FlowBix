require("dotenv/config");
const express = require("express");
const cors = require("cors");
const startDb = require("./config/db.js"); 
const usersRouter = require("./modules/users/usersRoute.js");
const authRouter = require("./modules/auth/authRoute.js");
const clientRoutes = require("./modules/clients/clientsRoute.js"); 
const errorHandler = require("./middlewares/errors/errorHandler.js");

const server = express();
const PORT = process.env.PORT;

server.use(express.json()); 
server.use(cors());

// Rotta di test iniziale per verificare il funzionamento
//server.get("/", (req, res) => {
//res.send("API di FlowBix funzionanti al 100%!");
//});

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);
server.use("/api/clients", clientRoutes); 

server.use(errorHandler);

startDb(PORT, server);