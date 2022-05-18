const Review = require('../models/reviewModel');
const UserService = require('./userServices');
const activeReviews = require('../metrics/prometheus').activeReviews;


// Create review
async function saveReview(review) {
    try {
        const res = await review.save()
        activeReviews.inc(1)
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
        if (res) {
            activeReviews.dec(1)
        }
        return res;
    } catch (err) {
        throw Error(err)
    };
}
module.exports.deleteOne = deleteOne;

// Delete all reviews for a publisher
async function deleteAll(id) {
    try {
        const user = await UserService.findOne(id)
        await UserService.updateUser(id, {$set: {reviewsIds: []}})
        const response = await Review.deleteMany({_id: {$in: user.reviewsIds}})
        activeReviews.dec(response['deletedCount']);
    } catch (err) {
        throw Error(err)
    };
}
module.exports.deleteAll = deleteAll;