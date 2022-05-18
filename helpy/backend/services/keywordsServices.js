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

// Create keyword
async function findKeywords(query, toKeep) {
    try {
        const result = await Keywords.find(query, toKeep).exec();
        return result;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.findKeywords = findKeywords;