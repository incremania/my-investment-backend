const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getSingleTransaction,
  getAllTransactions,
  getAllUserTransactions,
  updateTransaction,
  createDummyTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .post(
    "/",
    authenticateUser,
    authorizePermissions("user", "admin"),
    createTransaction
  )
  .post(
    "/dummy",
    authenticateUser,
    authorizePermissions("admin"),
    createDummyTransaction
  )
  .get(
    "/",
    authenticateUser,
    authorizePermissions("admin"),
    getAllTransactions
  )
  .get(
    "/user",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getAllUserTransactions
  )
  .get(
    "/:transactionId",
    authenticateUser,
    authorizePermissions("user", "admin"),
    getSingleTransaction
  )
  .patch(
    "/:transactionId",
    authenticateUser,
    authorizePermissions("admin"),
    updateTransaction
  )
  .delete(
    "/:transactionId",
    authenticateUser,
    authorizePermissions("admin"),
    deleteTransaction
  );
  
module.exports = router;
