const Transfer = require('../models/Transfer');
const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const invitation = require('../models/invitation');
const uuid = require('uuid').v4

const createTransfer = async (req, res) => {
    try {
        // Extract form data from the request body
        const { email, amount, walletType, password } = req.body;

        // Validate form data
        if (!email || !amount || !walletType || !password) {
            return res.status(400).json({ msg: 'All fields are required!' });
        }

        const user = await User.findOne({ _id: req.user.userId})

        if(amount < 1) {
              return res.status(400).json({ msg: 'Transfer must be more than $0' });
        } 

        if(user.balance < amount) {
            return res.status(400).json({ msg: 'Insufficient balance!' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        console.log(isValidPassword);
        if(!isValidPassword) {
            return res.status(400).json({ msg: 'Invalid password!' });
        }


        
        // Create a new form instance
        const transfer = await Transfer.create({
            user: req.user.userId,
            email,
            amount,
            walletType,
            password,
            transactionId: uuid().substring(1, 12)
        });

        console.log(transfer);

        if(transfer) {
       user.balance -= transfer.amount
        await user.save()
        }

      
     

        // Send success response
        res.status(200).json({ msg: 'Form submitted successfully!',  transfer});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({user: req.user.userId})
        if(!transfers) {
            return res.status(404).json({ msg: 'no transfer yet'})
        }
        console.log(transfers.length);
    res.status(200).json({ nbHits: transfers.length, transfers})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message})
    }
}
module.exports = {
    createTransfer,
    getUserTransfers
};
