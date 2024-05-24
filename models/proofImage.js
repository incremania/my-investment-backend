const { Schema, default: mongoose } = require('mongoose');

const ProofSchema = new Schema({
    image: {
        type: String,
        required: [true, 'please upload an image']
    }, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, 
{ timestamps: true}
)


module.exports = mongoose.model('ProofImage', ProofSchema)