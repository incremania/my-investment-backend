const {Schema, default: mongoose } = require('mongoose');

// Define the schema for the form data
const WithdrawalSchema = new Schema({
    wallet_type: {
        type: String,
        required: true,
        enum: ['balance', 'interest_balance'] // Only allows these values
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    },
    gateway: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    wallet: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    }
},
{timestamps: true}
);

// Create and export the model
const WithdrawalModel = mongoose.model('Withdrawal', WithdrawalSchema);

module.exports = WithdrawalModel;
