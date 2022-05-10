const mongoose = require('mongoose');  

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
    },  
    {
        timestamps: true
    }  
);

schema.index({ name: 1 }, {unique: true})

schema.method("toJSON", function () {  
    const {__v, _id, ...object} = this.toObject();  
    object.id = _id;  
    return object;  
});  

module.exports = mongoose.model("keyword", schema);