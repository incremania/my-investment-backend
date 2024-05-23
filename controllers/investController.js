const Investment = require('../models/investment');
const User = require('../models/UserModel')


const createInvestment = async(req, res) => {
    try {
const { investmentType, amount } = req.body
const user = await User.findOne({ _id: req.user.userId})
console.log(user);

if(amount  > user.balance) {
        return res.status(400).json({msg: "insufficient balance"})
}

const investment = await Investment.create({
   investmentType,
    amount,
    user: req.user.userId
})

if(!investment)  {
    return res.status(400).json({msg: "Investment not created" })
}

 if(investment) {
       
       user.balance -= investment.amount
       user.totalInvest += investment.amount
        await user.save()
        }

res.status(201).json({ investment, message: 'investment created successfully'})
    } catch(error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

const getUserInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ user: req.user.userId})
        if(!investments) {
            return res.status(400).json({msg: "No investments found" })
        }

        res.status(200).json({ nbhits: investments.length, investments})
    } catch (error) {
         console.log(error);
        res.status(500).json({ error })
    }
}


const getAllInvestment = async (req, res) => {
    try {
        const investments = await Investment.find({});
        if(!investments) {
            return res.status(400).json({msg: "No investments found" })

        }
                res.status(200).json({ nbhits: investments.length, investments})

    } catch (error) {
         console.log(error);
        res.status(500).json({ error })
    }
}

module.exports = {
    createInvestment,
    getUserInvestments,
    getAllInvestment
}