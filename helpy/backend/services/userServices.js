const User = require('../models/userModel');
const AdService = require('./adServices');
const ReviewService = require('./reviewServices');
const activeClients = require('../metrics/prometheus').activeClients;

require('dotenv').config();
const domain = process.env.AUTH0_DOMAIN;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const admin_role = process.env.AUTH0_ADMIN_ROLE_ID;
const ManagementClient = require("auth0").ManagementClient;

registerEmail='This is an auto-generated email! Do not reply!\nHello, you have just registered in our application!\n\nCongratulations!!!\n\nRegards,\nHelpy Team!'
reserveCustomerEmail='This is an auto-generated email! Do not reply!\nHello, you have just reserve an ad!\n\nCongratulations!!!\n\nRegards,\nHelpy Team!'
reservePublisherEmail='This is an auto-generated email! Do not reply!\nHello, you had one ad reserved in our application!\n\nCongratulations!!!\n\nRegards,\nHelpy Team!'

const management = new ManagementClient({
    domain: `${domain}`,
    clientId: `${client_id}`,
    clientSecret: `${client_secret}`
});

// Asign publisher Role
async function assignRole(userGuid) {
    var dataU = { "users" : [ userGuid ]};

    try {
        await management.roles.assignUsers({ id: admin_role}, dataU);
    } catch (err) {
        throw Error(err)
    }
}
module.exports.assignRole = assignRole;

// Create user
async function saveUser(user) {
    try {
        // sendMail("samoilescusebastian@gmail.com", registerEmail) // req.body.email
        const res = await user.save()
        activeClients.inc(1);
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
async function deleteUser(guid, isPublisher) {
    try {
        const user = await User.findOne({guid: guid})
        if (isPublisher) { // are review-uri si trb sterse
            await ReviewService.deleteAll(user.id)
        } else { // are ad-uri in bd si trb sterse
            // se sterg ad-urile si din lista customerilor daca exista in ele
            await AdService.deleteAllFromPublisher(user.id)
        }
        await management.users.delete({ id: guid }, function (err) {
            if (err) {
                throw Error('Auth0 delteing error')
            }
        });
        const res = await User.findByIdAndRemove(user.id)
        if (res) {
            activeClients.dec(1);
        }
        return res;
    } catch(err) {
        throw Error(err)
    }
}
module.exports.deleteUser = deleteUser;

async function updateReviewsScore(id, reviewId, reviewScore, isPublisher) {
    try {
        if (isPublisher === 'true') {
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

async function removeAdFromCustomers(id) {
    try {
        let query = { $pull: {adsIds: id}}
        const result = await User.updateOne({'adsIds': id}, query)
        return result;
    } catch (err) {
        throw Error(err)
    }
}
module.exports.removeAdFromCustomers = removeAdFromCustomers;

async function findCustomerFromAd(id) {
    try {
        const result = await User.findOne({'adsIds': id})
        return result;
    } catch (err) {
        throw Error(err)
    }
}
module.exports.findCustomerFromAd = findCustomerFromAd;

// Reserve ad
async function reserveAd(guid, adId, isPublisher) {
    try {
        if (isPublisher === 'false') {
            // const user = await findOneByGuid(guid)
            // sendMail("samoilescusebastian@gmail.com", reserveCustomerEmail) // user.email
            // const ad = await Ad.findOne(adId).populate('publisherId')
            // sendMail("samoilescusebastian@gmail.com", reservePublisherEmail) // ad.publisherId.email
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