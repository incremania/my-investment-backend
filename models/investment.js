const { Schema, default: mongoose } = require('mongoose');

const investmentSchema = new Schema({
    investmentType: {
        type: String,
        enum: {
            values: ['basic', 'index', 'silver'],
            message: '{VALUE} is not supported'
        },
        required: [true, 'Investment type not provided']
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "successful", "failed"],
            message: "{VALUE} is not supported",
        },
        default: "pending",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);
