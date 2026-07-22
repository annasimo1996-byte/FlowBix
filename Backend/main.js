require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const startDb = require("./config/db.js");

const usersRoute = require("./modules/users/usersRoute.js");
const authRoute = require("./modules/auth/authRoute.js");
const clientsRoute = require("./modules/clients/clientsRoute.js")
const appointmentsRoute = require("./modules/appointments/appointmentsRoute.js");
const financeRoute = require("./modules/finance/financeRoute.js")
const dashboardRoute = require ("./modules/dashboard/dashboardRoute.js")
const errorHandler = require("./middlewares/errorHandler.js");
const server = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "https://flowbix.vercel.app",
  process.env.CLIENT_URL,
];

require("dotenv").config();
server.use(express.json());
server.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

server.use(passport.initialize());

server.use("/users", usersRoute);
server.use("/dashboard", dashboardRoute);
server.use("/clients", clientsRoute)
server.use("/appointments", appointmentsRoute);
server.use("/finance", financeRoute )
server.use("/auth", authRoute);

server.use(errorHandler);

startDb(PORT, server);