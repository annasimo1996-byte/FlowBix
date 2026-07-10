const express = require('express');
const router = express.Router();
const { getClients, createClient, updateClient, deleteClient } = require("./clientsControllers");
const { protect: verifyToken } = require('../../middlewares/authMiddleware')

router.get('/', verifyToken, getClients);
router.post('/', verifyToken, createClient);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);

module.exports = router;