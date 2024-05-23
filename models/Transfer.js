const { Schema, default: mongoose } = require('mongoose');

// Define the schema for the Transfer data
const TransferSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['success', 'failed', 'pending'] ,
        default: 'success' 
    },
    walletType: {
        type: String,
        required: true,
        enum: ['balance', 'interest_balance'] 
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create and export the model
const TransferModel =  mongoose.model('Transfer', TransferSchema);

module.exports = TransferModel;
