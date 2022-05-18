const Keywords = require('../models/keywordModel');

// Create keyword
async function saveKeyword(keyword) {
    try {
        var query = {name: keyword.toLowerCase()},
        update = {},
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const result = await Keywords.findOneAndUpdate(query, update, options).exec();
        return result;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.saveKeyword = saveKeyword;