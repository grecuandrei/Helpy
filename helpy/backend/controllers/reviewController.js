const Review = require('../models/reviewModel');
const User = require('../models/userModel');

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

    const user = await User.findOne({guid: req.body.customerGUID}, {_id: 1});

    // Create a review
    const review = new Review({
        customerId: user._id,
        score: req.body.score,
        description: req.body.description,
        adId: req.body.adId
    });

    // Save review in the database
    await review
        .save(review)
        .then(data => {
            console.log('[ReviewController][Create][INFO]:' + ' ' + "review was sucessfully added!");
            res.status(200).send(data);
        })
        .catch(err => {
            console.log('[ReviewController][Create][ERROR]:' + ' ' + "Some error occurred while creating the review.");
            console.log(err)
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the review."
            });
        });
};

// Delete all reviews from the database for publisher.
exports.deleteAll = async (req, res) => {
    if (!req.params) {
        console.log('[ReviewController][DeleteAll][ERROR]:' + ' ' + "Params can not be empty!");
        return res.status(400).send({
            message: "Params can not be empty!"
        });
    }

    const {id} = req.params;

    const user = await User.findById(id)

    await User.findByIdAndUpdate(id, {$set: {reviewsIds: []}})
        .catch(err => {
            console.log('[ReviewController][DeleteAll][ERROR]:' + ' ' + "Some error occurred while removing all reviews.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all reviews."
            });
            return;
        });

    await Review.deleteMany({_id: {$in: user.reviewsIds}})
        .then(data => {
            if (data) {
                console.log('[ReviewController][DeleteAll][INFO]:' + ' ' + `${data.deletedCount} Reviews were deleted successfully!`);
                res.status(200).send({
                    message: `${data.deletedCount} Reviews were deleted successfully!`
                });
                return;
            }
            console.log('[ReviewController][DeleteAll][ERROR]:' + ' ' + `Error deleting reviews!`);
            res.status(401).send({
                message: `Error deleting reviews!`
            });
            return;
        })
        .catch(err => {
            console.log('[ReviewController][DeleteAll][ERROR]:' + ' ' + "Some error occurred while removing all reviews.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all reviews."
            });
        });
};