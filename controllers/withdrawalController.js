const WithdrawalModel = require('../models/withdrawal');
const User = require('../models/UserModel')
const uuid = require('uuid').v4

// Controller function to handle form submissions
const createWithdrawal = async (req, res) => {
    try {
        // Extract data from the request body
        const { wallet_type, gateway, amount, wallet, status, userId } = req.body;
        const user = await User.findOne({ _id: req.user.userId})
        
        
    let gatewayValue;

        // Conditionally set the gateway value based on the request body
        if (gateway == 1) {
            gatewayValue = "ETH";
        } else if (gateway == 2) {
            gatewayValue = "BTC";
        } else if(gateway == 3){
          gatewayValue = 'USDT (TRC20)'
        } else if(gateway == 5) {
            gatewayValue = 'USDT (ERC20)'
        } else if(gateway == 4) {
            gatewayValue = 'Bank Transfer'
        } else if(gateway == 6) {
            gatewayValue = 'SHIBA'
        }


        // Create a new instance of the WithdrawalModel with the extracted data
        const withdrawal = new WithdrawalModel({
            wallet_type,
            gateway: gatewayValue,
            amount,
            wallet,
            status,
            userId: req.user.userId,
            transactionId: uuid().substring(1, 12)
        });

        if(!withdrawal.amount) {
           return res.status(400).json({ message: "input withdrawal amount"})
        }
         if(!withdrawal.wallet) {
           return res.status(400).json({ message: "input withdrawal wallet"})
        }
        
        if(withdrawal.amount > user.balance) {
           return res.status(400).json({ message: "insufficient funds"})
        }
           await withdrawal.save()
        res.status(200).json({ message: 'Form data saved successfully' , withdrawal});
    } catch (error) {
        // Handle errors
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserWithdrawals = async(req, res) => {
    try {
        const withdrawals = await WithdrawalModel.find({})
        if(!withdrawals) {
            return res.status(404).json({ message: 'no withdrawal found'})
        }

        res.status(200).json({ nbHits: withdrawals.length, withdrawals})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
};

const updateWithdrawal = async (req, res) => {
  try {
    const { withdrawalId } = req.params;

    
    const { status } = req.body;

    // Find the existing withdrawal by ID
    const withdrawal = await WithdrawalModel.findById(withdrawalId);
    if (!withdrawal) {
      return res.status(404).json({ status: "error", message: "Withdrawal not found" });
    }

    // Find the user associated with the withdrawal
    const user = await User.findById(withdrawal.userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Update the withdrawal status
    withdrawal.status = status;

     if(withdrawal.amount >= user.balance) {
           return res.status(400).json({ message: "insufficient funds"})
        }

    // If the status is 'successful', update the user's balance
    if (status === 'successful' ) {
      user.balance -= withdrawal.amount;
      user.totalWithdrawal += withdrawal.amount
      await user.save();
    }

    // Save the updated withdrawal
    await withdrawal.save();

    // Send a success response
    res.status(200).json({ status: "success", withdrawalDetails: withdrawal });
  } catch (error) {
    console.error('Error updating withdrawal:', error);
    res.status(500).json({ status: "error", message: 'Internal server error' });
  }
};


module.exports = {
    createWithdrawal,
    getUserWithdrawals,
    updateWithdrawal
};
