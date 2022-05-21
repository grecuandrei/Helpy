const Ad = require('../models/adModel');
const Keyword = require('../models/keywordModel');
const UserService = require('./userServices');
const KeywordService = require('./keywordsServices');
const activeAds = require('../metrics/prometheus').activeAds;

// Create ad
async function saveAd(ad) {
    try {
        const res = await ad.save()
        activeAds.inc(1)
        return res;
    } catch (err) {
        console.log(err)
        throw Error(err)
    };
}
module.exports.saveAd = saveAd;

// Find ad by id
async function findOne(id) {
    try {
        const ad = await Ad.findById(id).populate('keywords', 'name')
        return ad;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOne = findOne;

// Retrieve all ADs untaken from the database based on title and/or array of keywords.
async function findAll(keywords) {
    try {
        const ads = await Ad.find({taken: false}).populate('keywords', 'name').populate('publisherId', 'name surname')

        if (keywords === '[]' || keywords === undefined) {
            return ads;
        }
        const keywordsName = JSON.parse(keywords)
        let finalAds = []
        for (let ad of ads) {
            if (keywordsName.every(element => {return ad.keywords.map(a => a.name).includes(element);})) {
                finalAds.push(ad)
            }
        }
        return finalAds;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAll = findAll;

// Retrieve all ADs for a publisher.
async function findAllPublisher(guid) {
    try {
        const user = await UserService.findOneByGuid(guid)
    
        const ads = await Ad.find({publisherId: user.id}, {'title': 1, 'description': 1, 'keywords': 1, 'endDate': 1, 'taken': 1}).populate('keywords', 'name')
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAllPublisher = findAllPublisher;

// Retrieve all ADs for a publisher.
async function findAllPublisherTaken(guid) {
    try {

        const user = await UserService.findOneByGuid(guid)
    
        const ads = await Ad.find({taken: true, publisherId: user.id}, {'title': 1, 'description': 1, 'keywords': 1, 'endDate': 1}).populate('keywords', 'name')
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findAllPublisherTaken = findAllPublisherTaken;

// Retrieve all ADs for a publisher.
async function findAllCustomer(keywords, guid) {
    try {
        const user = await UserService.findOneByGuid(guid)

        if (keywords === '[]' || keywords === undefined) {
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
            if (result) {
                activeAds.dec(1)
            }
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
    try {
        const user = await UserService.findOne(id)
        const ads = await findAllPublisher(undefined, undefined, user.guid)
        for (let ad of ads) {
            await UserService.removeAdFromCustomers(ad.id)
            await deleteAd(ad.id)
        }
        return;
    } catch(err) {
        throw Error(err)
    }
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

async function makeAvailable(id) {
    try {
        const res = await Ad.updateAd(id, {$set : { taken: false }})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.makeAvailable = makeAvailable

async function topXLiked(x, guid) {
    try {
        const user = await UserService.findOneByGuid(guid)
    
        const ads = await Ad.find({publisherId: user.id}, {'title': 1, 'id': 1, 'likes':1}).sort('-likes').limit(x)
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.topXLiked = topXLiked;

async function topXViewed(x, guid) {
    try {
        const user = await UserService.findOneByGuid(guid)
        if(x === 0) return undefined;
    
        const ads = await Ad.find({publisherId: user.id}, {'title': 1, 'id': 1, 'views':1}).sort('-views').limit(x)
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.topXViewed = topXViewed;

async function topViewedKeyword(keyword, guid) {
    try {
        const query = {'name': keyword}
        const user = await UserService.findOneByGuid(guid)
        const key = await Keyword.findOne(query)

        const ads = []
        if (key) {
            ads = await Ad.find({keywords: key.id, publisherId: user.id}, {'title': 1, 'id': 1, 'views':1}).sort('-views').limit(3)
        } else {
            ads = await Ad.find({publisherId: user.id}, {'title': 1, 'id': 1, 'views':1}).sort('-views').limit(3)
        }
    
        return ads;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.topViewedKeyword = topViewedKeyword;