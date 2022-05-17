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
exports.assignRole = async function (userGuid) {
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

// Create user
exports.saveUser = async function(user) {
    try {
        const res = await user.save(user)
        return res;
    } catch (err) {
        throw Error(err)
    };
}

exports.findOne = async function(userId) {
    try {
        const user = await User.findById(userId)
        return user;
    } catch(err) {
        throw Error(err)
    }
}

exports.findOneByGuid = async function(userGuid) {
    try {
        const user = await User.findOne({guid: userGuid}).populate('adsIds').populate('reviewsIds')
        return user;
    } catch(err) {
        throw Error(err)
    }
}

exports.updateUser = async function(id, query) {
    try {
        const res = await User.findByIdAndUpdate(id, {...query}, {useFindAndModify: false})
        return res;
    } catch(err) {
        throw Error(err)
    }
}

exports.deleteUser = async function(id, isPublisher) {
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

// TODO
exports.updateReviews = async function(id, reviewId) {

}

// TODO
exports.reserveAd = async function(guid, adId) {

}