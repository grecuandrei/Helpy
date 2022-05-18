const Review = require('../models/reviewModel');
const UserService = require('./userServices');

// Create review
async function saveReview(review) {
    try {
        const res = await review.save()
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.saveReview = saveReview;

// Delete review
async function deleteOne(id) {
    try {
        const res = await Review.findByIdAndRemove(id)
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.deleteOne = deleteOne;

// Delete all reviews for a publisher
async function deleteAll(id) {
    try {
        const user = await UserService.findOne(id).exec()
        await UserService.updateUser(id, {$set: {reviewsIds: []}})
        await Review.deleteMany({_id: {$in: user.reviewsIds}})
    } catch (err) {
        throw Error(err)
    };
}
module.exports.deleteAll = deleteAll;