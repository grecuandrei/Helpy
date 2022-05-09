const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        identityGuid: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        pid: {
            type: String,
            required: true
        },
        isPublisher: {
            type: Boolean,
            default: false
        },
        score: {
            type: Number,
            default: 0
        },
        reviews: [{
            type: ObjectId,
            ref: 'review'
        }],
        adsIds: [{
            type: ObjectId,
            ref: 'ad'
        }]
    },  
    {
        timestamps: true
    }  
);

schema.index({ email: 1 }, {unique: true})
schema.index({ pid: 1 }, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("user", schema);