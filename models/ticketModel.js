const { Schema, default: mongoose } = require('mongoose');

const TicketSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    attachmentUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'opened'],
        default: 'pending'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }


}, 
{timestamps: true}
);

module.exports = mongoose.model('Ticket', TicketSchema);
