require("dotenv/config");
const express = require("express");
const cors = require("cors");
const startDb = require("./config/db.js"); 

const server = express();
const PORT = process.env.PORT;

server.use(express.json()); 
server.use(cors());

// Rotta di test iniziale per verificare il funzionamento
server.get("/", (req, res) => {
  res.send("API di FlowBix funzionanti al 100%!");
});

startDb(PORT, server);