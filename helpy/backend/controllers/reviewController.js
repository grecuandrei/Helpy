const Review = require('../models/reviewModel');
const UserService = require('../services/userServices');
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

    const user = await UserService.findOneByGuid(req.body.customerGUID);

    // Create a review
    const review = new Review({
        customerId: user._id,
        score: req.body.score,
        description: req.body.description,
        adId: req.body.adId
    });

    // Save review in the database
    try {
        const result = await ReviewService.saveReview(review)
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
