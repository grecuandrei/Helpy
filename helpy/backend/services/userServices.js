const User = require('../models/userModel');
const AdService = require('./adServices');
const ReviewService = require('./adServices');

require('dotenv').config();
const domain = process.env.AUTH0_DOMAIN;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const admin_role = process.env.AUTH0_ADMIN_ROLE_ID;
const ManagementClient = require("auth0").ManagementClient;

// Asign publisher Role
async function assignRole(userGuid) {
    const management = new ManagementClient({
        domain: `${domain}`,
        clientId: `${client_id}`,
        clientSecret: `${client_secret}`
    });

    var dataU = { "users" : [ userGuid ]};

    try {
        await management.roles.assignUsers({ id: admin_role}, dataU);
    } catch (e) {
        console.log(e);
    }
}
module.exports.assignRole = assignRole;

// Create user
async function saveUser(user) {
    try {
        const res = await user.save()
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.saveUser = saveUser;

// Find user by id
async function findOne(userId) {
    try {
        const user = await User.findById(userId)
        return user;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOne = findOne;

// Find user by guid
async function findOneByGuid(userGuid) {
    try {
        const user = await User.findOne({guid: userGuid})
            .populate({
                path : 'adsIds',
                    populate : {
                        path : 'keywords'
                    }
            })
            .populate('reviewsIds')
        return user;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.findOneByGuid = findOneByGuid;

// Update user by id
async function updateUser(id, query) {
    try {
        const res = await User.findByIdAndUpdate(id, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.updateUser = updateUser;

// Update user by guid
async function updateUserByGuid(guid, query) {
    try {
        const res = await User.findOneAndUpdate({guid: guid}, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.updateUserByGuid = updateUserByGuid;

// Delete user
async function deleteUser(id, isPublisher) {
    try {
        if (isPublisher) { // are review-uri si trb sterse
            const user = await User.findById(id).populate('reviewsIds')
            if (user.reviewsIds.length !== 0) {
                for (let reviewId of user.reviewsIds) await ReviewService.delete(reviewId)
            }
        }
        else { // are ad-uri in bd si trb sterse
            await AdService.deleteAllFromPublisher(id) // in asta ar trb sterse si din lista customerilor daca exista in ele
        }
        const res = await User.findByIdAndRemove(id)
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.deleteUser = deleteUser;

async function updateReviewsScore(id, reviewId, reviewScore, isPublisher) {
    try {
        if (isPublisher) {
            const user = await findOne(id)
            let newScore = user.score;
            if (newScore !== 0) {
                newScore = (newScore + reviewScore) / 2.0
            }

            const query = {
                $push: {
                    reviewsIds: reviewId
                },
                score: newScore
            }

            const result = await updateUser(id, query)
            return result;
        } else {
            throw Error('Can\'t perform this action as a customer!')
        }
    } catch (err) {
        throw Error(err)
    }
}
module.exports.updateReviewsScore = updateReviewsScore;

// Reserve ad
async function reserveAd(guid, adId, isPublisher) {
    try {
        if (isPublisher === 'false') {
            console.log(isPublisher === false)
            const query = {
                $push: {
                    adsIds: adId
                },
            }

            const res_q = {$set: {taken:true}}

            const result = await AdService.updateAd(adId, res_q)
            if (!result) {
                throw Error('Error reserving ad')
            }

            const res = await updateUserByGuid(guid, query)
            return res;
        } else {
            throw Error('Can\'t perform this action as a publisher!')
        }
    } catch (err) {
        throw Error(err)
    }
}
module.exports.reserveAd = reserveAd;