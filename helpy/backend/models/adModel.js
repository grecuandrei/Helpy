const { ObjectId } = require("mongodb");
const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        publisherId: {
            type: ObjectId,
            ref: 'publisher',
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        taken: {
            type: Boolean,
            default: false
        },
    },  
    {
        timestamps: true
    }  
);

schema.index({ publisher: 1, name: 1}, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("ad", schema);