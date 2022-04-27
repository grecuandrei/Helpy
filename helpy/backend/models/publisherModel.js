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

module.exports = mongoose.model("publisher", schema);