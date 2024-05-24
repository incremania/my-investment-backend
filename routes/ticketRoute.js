
const express = require("express");
const router = express.Router();
const {
createTicket,
getUserTickets,
    getAllTickets
} = require("../controllers/ticketController")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createTicket
  )
  .get(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getUserTickets
  )
  .get('/all', authenticateUser, authorizePermissions('admin'), getAllTickets)

  
module.exports = router;



