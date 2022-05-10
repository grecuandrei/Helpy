const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        publisherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
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
        keywords: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'keyword',
            default: []
        }]
    },  
    {
        timestamps: true
    }  
);

schema.index({ user: 1, title: 1}, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("ad", schema);