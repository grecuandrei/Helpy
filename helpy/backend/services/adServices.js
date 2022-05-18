const Ad = require('../models/adModel');
const UserService = require('./userServices');
const User = require('../models/userModel');
const Keywords = require('../models/keywordModel');

// Create ad
async function saveAd(ad) {
    try {
        const res = await ad.save()
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.saveAd = saveAd;

// Find ad by id
async function findOne(id) {
    try {
        const ad = await Ad.findById(id)
        return ad;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOne = findOne;

// Retrieve all ADs untaken from the database based on title and/or array of keywords.
async function findAll(title, keywords) {
    try {
        let condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

        if (keywords !== '[]') {
            const keywordsName = JSON.parse(keywords)
            const keywordsIds = JSON.stringify(keywordsName) !== JSON.stringify([]) ? await Keywords.find({name: {$in: keywordsName}}, {_id: 1}).exec() : undefined;
            condition = keywordsIds ? {...condition, 'keywords': {$all: keywordsIds}} : condition
        }
    
        const ads = await Ad.find({...condition, taken: false}).populate('keywords', 'name')
        return ads;
    } catch(err) {
        console.log(err)
        throw Error(err)
    }
}
module.exports.findAll = findAll;

// Retrieve all ADs for a publisher.
async function findAllPublisher(title, keywords, guid) {
    try {
        let condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

        if (keywords) {
            const keywordsName = JSON.parse(keywords)
            const keywordsIds = JSON.stringify(keywordsName) !== JSON.stringify([]) ? await Keywords.find({name: {$in: keywordsName}}, {_id: 1}).exec() : undefined;
            condition = keywordsIds ? {...condition, 'keywords': {$all: keywordsIds}} : condition
        }

        const user = await UserService.findOneByGuid(guid)
    
        const ads = await Ad.find({...condition, publisherId: user.id}).populate('keywords', 'name')
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAllPublisher = findAllPublisher;

// Retrieve all ADs for a publisher.
async function findAllCustomer(keywords, guid) {
    try {
        const user = await UserService.findOneByGuid(guid)

        if (keywords === '[]') {
            return user.adsIds;
        }
        let ads = []
        const keywordsName = JSON.parse(keywords)
        for (let ad of user.adsIds) {
            if (keywordsName.every(element => {return ad.keywords.map(a => a.name).includes(element);})) {
                ads.push(ad)
            }
        }
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAllCustomer = findAllCustomer;

// Update ad by id
async function updateAd(id, query) {
    try {
        const res = await Ad.findByIdAndUpdate(id, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.updateAd = updateAd;

// Delete Ad
async function deleteAd(id) {
    try {
        const ad = await findOne(id)
        if (!ad.taken) {
            const result = await Ad.findByIdAndRemove(id)
            return result;
        } else {
            throw Error('Can\'t delete an ad that is reserved!')
        }
    } catch(err) {
        throw Error(err)
    }
}
module.exports.deleteAd = deleteAd;

// Delete All ads from publisher
async function deleteAllFromPublisher(id) {
    // TODO
    // try {
    //     const ad = await findOne(id)
    //     if (!ad.taken) {
    //         const result = await Ad.findByIdAndRemove(id)
    //         return result;
    //     } else {
    //         throw Error('Can\'t delete an ad that is reserved!')
    //     }
    // } catch(err) {
    //     throw Error(err)
    // }
    throw Error('Not implemented yet')
}
module.exports.deleteAllFromPublisher = deleteAllFromPublisher;


// Update ad by id
async function unlikeAd(id, query) {
    try {
        const res = await Ad.findOneAndUpdate({id, likes: {$gt: 0}}, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.unlikeAd = unlikeAd;