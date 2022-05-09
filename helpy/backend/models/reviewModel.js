const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        userId: {
            type: ObjectId,
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
            type: ObjectId,
            ref: 'ad',
        },
    },  
    {
        timestamps: true
    }  
);

schema.index({ user: 1, name: 1}, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("ad", schema);