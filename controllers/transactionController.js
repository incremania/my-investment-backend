const Transaction = require("../models/TransactionModel");
const User = require('../models/UserModel');
const uuid = require("uuid").v4;


const createTransaction = async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.userId)
    const { amount, operationType, status, paymentMethod} = req.body;
 
    if(!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

      if(operationType === 'withdrawal' && user.balance < amount) {
        return res.status(400).json({ error: 'insufficient funds'})
      }

      
      if(amount == 0) {
         return res.status(400).json({ error: 'invalid amount'})

      }
    const transaction = await Transaction.create({
      amount,
      user: user._id,
      operationType,
      status,
      paymentMethod,
      firstname: user.firstname,
      email:user.email,
      accountId: user.accountId,
      transactionId: uuid().substring(1, 12),
    });

    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      transactionDetails: transaction,
    });
  } catch (error) {
    console.log(error)
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
    if (!transaction) {
      return res.status(404).json({ status: "error", message: "Transaction not found" });
    }

    // Update the transaction status and createdAt fields
    transaction.status = status;
 
    // If the transaction status is 'successful', update the user's balance
    if (status === 'successful' && transaction.operationType === 'deposit') {
      const user = await User.findById(transaction.user);
      if (user) {
        user.balance += transaction.amount;
        await user.save();
      } else {
        return res.status(404).json({ status: "error", message: "User not found" });
      }
    }

    if(status === 'successful' && transaction.operationType === 'withdrawal') {
      const user = await User.findById(transaction.user)
      if(user) {
        user.balance -= transaction.amount
        await user.save()
      } else {
        return res.status(404).json({ status: "error", message: "User not found" });

      }
    }



    await transaction.save();

    res.status(200).json({ status: "success", transactionDetails: transaction });
  } catch (error) {
  
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

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        if (!gateway) {
            return res.status(400).json({ error: 'Gateway is required' });
        }

        const transaction = await Transaction.create({
            amount,
            user: req.user.userId, 
            operationType: 'add-fund',
            status: 'pending',
            transactionId: uuid(),
        });

        authorizePermissions(req.user, transaction._id);

        const response = {
            amount,
            gateway,
            charge: 10, 
            payable: parseFloat(amount) + 10 
        };

        // Send the response
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}