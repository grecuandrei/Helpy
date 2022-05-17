const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        score: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: true
        },
        adId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ad',
        },
    },  
    {
        timestamps: true
    }  
);

schema.index({ customerId: 1, adId: 1}, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("review", schema);