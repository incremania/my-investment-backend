const Investment = require('../models/investment');
const User = require('../models/UserModel')


const createInvestment = async (req, res) => {
    try {
        const { investmentType, amount } = req.body;
        const user = await User.findOne({ _id: req.user.userId });
        console.log(user);

        if (amount > user.balance) {
            return res.status(400).json({ msg: "Insufficient balance" });
        }

        
        let returnInterest;
        switch (investmentType) {
            case 'basic':
                returnInterest = 115 * amount; 
                break;
            case 'silver':
                returnInterest = 144 * amount;
                break;
            case 'index':
                returnInterest = 186 * amount; 
                break;
            default:
                return res.status(400).json({ msg: "Invalid investment type" });
        }


        const investment = await Investment.create({
            investmentType,
            amount,
            returnInterest,
            user: req.user.userId,
            upcomingPayment: 0
        });

        if (!investment) {
            return res.status(400).json({ msg: "Investment not created" });
        }

        if (investment) {
            user.balance -= investment.amount;
            user.totalInvest += investment.amount;
            await user.save();
        }

        res.status(201).json({ investment, message: 'Investment created successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

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