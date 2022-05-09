const Review = require('../models/reviewModel');
const User = require('../models/userModel');

// Create and Save a new Review
exports.create = async (req, res) => {
    //  Validate request
    if (!req.body.score) {
        res.status(400).send({message: "score can not be empty!"});
        return;
    } else if (!req.body.description) {
        res.status(400).send({message: "description can not be empty!"});
        return;
    } else if (!req.body.customerId) {
        res.status(400).send({message: "userId can not be empty!"});
        return;
    } else if (!req.body.adId) {
        res.status(400).send({message: "adId can not be empty!"});
        return;
    }

    // Create a review
    const review = new Review({
        customerId: req.body.customerId,
        score: req.body.score,
        description: req.body.description,
        adId: req.body.adId
    });

    // Save review in the database
    await review
        .save(review)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
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
        return res.status(400).send({
            message: "Params can not be empty!"
        });
    }

    const {id} = req.params;

    const user = await User.findById(id)

    await User.findByIdAndUpdate(id, {$set: {reviewsIds: []}})
        .catch(err => {
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
                res.status(200).send({
                    message: `${data.deletedCount} Reviews were deleted successfully!`
                });
                return;
            }
            res.status(401).send({
                message: `Error deleting reviews!`
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all reviews."
            });
        });
};