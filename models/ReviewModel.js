const { Schema, default:mongoose } = require('mongoose');

const ReviewSchema = new Schema({
    name: {
        type: String,
    },
    content: {
        type: String
    },
    rating: {
        type: Number,
        default: 1
    },
    image: {
        type: String
    }
},
{timestamps: true}
)


module.exports = mongoose.model('Review', ReviewSchema)