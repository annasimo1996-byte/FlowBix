const express = require("express");
const router = express.Router();
const { protect } = require("../../middlewares/auth/authMiddleware.js");
const clientsControllers = require("./clientsControllers.js");

router.get("/", protect, clientsControllers.getClients);

router.post("/", protect, clientsControllers.addClient);

router.delete("/:id", protect, clientsControllers.removeClient);
router.put("/:id", protect, clientsControllers.updateClient);

module.exports = router;