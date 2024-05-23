const Transaction = require("../models/TransactionModel");
const User = require('../models/UserModel')
const uuid = require("uuid").v4;
const authorizePermissions = require("../utils/authorizePermission");
const createTransaction = async (req, res) => {
  try {
    const { amount, operationType, status, gateway } = req.body;
    const transaction = await Transaction.create({
      amount,
      user: req.user.userId,
      operationType,
      status,
      gateway,
      transactionId: uuid().substring(1, 12),
    });
    const user = await User.findOne({_id: req.user.userId})
    console.log(user);

   
    //  if(transaction) {
    //    user.balance += transaction.amount
    //     await user.save()
    //     }

    res.status(201).json({
      status: "success",
      message: "transaction created successfully",
      transactionDetails: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getSingleTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);
  
    authorizePermissions(req.user, transaction._id);
    if (!transaction) {
      return res
        .status(404)
        .json({ status: "error", message: "transaction not found" });
    }
    res
      .status(200)
      .json({ status: "success", transactionDetails: transaction });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUserTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ user: userId });

    res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createDummyTransaction = async (req, res) => {
  try {
    const { amount, operationType, status, user } = req.body;
    const transaction = await Transaction.create({
      amount,
      user, // this is a user id
      operationType,
      status,
      transactionId: uuid(),
    });

    res.status(201).json({
      status: "success",
      message: "transaction created successfully",
      transactionDetails: transaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});

    res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const updateTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    console.log(transactionId);
    const { status } = req.body;

    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);
    console.log(transaction);
    if (!transaction) {
      return res.status(404).json({ status: "error", message: "Transaction not found" });
    }

    // Update the transaction status and createdAt fields
    transaction.status = status;
 

    // If the transaction status is 'successful', update the user's balance
    if (status === 'successful') {
      const user = await User.findById(transaction.user);
      if (user) {
        user.balance += transaction.amount;
        await user.save();
      } else {
        return res.status(404).json({ status: "error", message: "User not found" });
      }
    }

    // Save the updated transaction
    await transaction.save();

    // Send a success response
    res.status(200).json({ status: "success", transactionDetails: transaction });
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;
    await Transaction.findByIdAndDelete(transactionId);
    res
      .status(200)
      .json({ status: "success", message: "transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getSingleTransaction,
  getAllTransactions,
  getAllUserTransactions,
  updateTransaction,
  createDummyTransaction,
  deleteTransaction,
};


const addFunds = async(req, res) => {
   try {
        const { amount, gateway } = req.body;

        // Perform any necessary validation on amount and gateway
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!gateway) {
            return res.status(400).json({ error: 'Gateway is required' });
        }

        // Process the request and generate response
        const transaction = await Transaction.create({
            amount,
            user: req.user.userId, // Assuming you have user information in the request
            operationType: 'add-fund',
            status: 'pending',
            transactionId: uuid(),
        });

        authorizePermissions(req.user, transaction._id);

        const response = {
            amount,
            gateway,
            charge: 10, // Example charge
            payable: parseFloat(amount) + 10 // Example payable amount
        };

        // Send the response
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}