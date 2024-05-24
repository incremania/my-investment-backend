const { Schema, default: mongoose} = require('mongoose')

const profileImage = new Schema({
    image: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, 
{ timestamps: true}
)


module.exports = mongoose.model('ProfileImage', profileImage)