const Review = require('../models/reviewModel');
const UserService = require('../services/userServices');
const AdService = require('../services/adServices');
const ReviewService = require('../services/reviewServices');
const activeReviews = require('../metrics/prometheus').activeReviews;

// Create and Save a new Review
exports.create = async (req, res) => {
    let message;
    //  Validate request
    if (!req.body.score) {
        message = "score can not be empty!";
    } else if (!req.body.description) {
        message = "description can not be empty!";
    } else if (!req.body.customerGUID) {
        message = "customerGUID can not be empty!";
    } else if (!req.body.adId) {
        message = "adId can not be empty!";
    }

    if (message) {
        console.log('[ReviewController][Create][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    const customer = await UserService.findOneByGuid(req.body.customerGUID);

    // Create a review
    const review = new Review({
        customerId: customer._id,
        score: req.body.score,
        description: req.body.description,
        adId: req.body.adId
    });

    // Save review in the database
    try {
        const result = await ReviewService.saveReview(review)
        const query = { $push: { reviewsIds: result.id }}
        const ad = await AdService.findOne(req.body.adId)
        await UserService.updateUser(ad.publisherId, query)
        await AdService.updateAd(req.body.adId, {reviewed: true})
        console.log('[ReviewController][Create][INFO]:' + ' ' + "review was sucessfully added!");
        res.status(201).send(result);
    } catch (err) {
        console.log('[ReviewController][Create][ERROR]:' + ' ' + "Some error occurred while creating the review.");
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while creating the review."
        });
    }
};

// Delete a Ad with the specified id in the request
exports.deleteOne = async (req, res) => {
    let message;
    if (!req.params.id) {
        message = "Params can not be empty!"
    }

    if (message) {
        console.log('[ReviewController][DeleteOne][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    const {id} = req.params;

    try {
        const result = await ReviewService.deleteOne(id)
        if (!result) {
            console.log('[ReviewController][DeleteOne][ERROR]: ' + `Cannot delete ad with id=${id}. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot delete review with id=${id}. Maybe review was not found!`
            });
        } else {
            console.log('[ReviewController][DeleteOne][Info]: ' + "Review was deleted successfully!");
            res.status(200).send({
                message: "Review was deleted successfully!"
            });
        }
    } catch (err) {
        console.log('[ReviewController][DeleteOne][ERROR]:' + ' ' + "Some error occurred while creating the review.");
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while deleting the review."
        });
    }
}
