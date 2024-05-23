const { Schema, default: mongoose } = require('mongoose');

const  invitationSchema = new Schema({
    invitationCode: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})


module.exports = mongoose.model('InvitationCode', invitationSchema)