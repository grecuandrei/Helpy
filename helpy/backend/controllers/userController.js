const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Ad = require('../models/adModel');

// Create and Save a new User
exports.create = async (req, res) => {
    //  Validate request
    // if (!req.body.identityGuid) {
    //     res.status(400).send({message: "identityGuid can not be empty!"});
    //     return;
    // } else
    if (!req.body.email) {
        res.status(400).send({message: "email can not be empty!"});
        return;
    } else if (!req.body.name) {
        res.status(400).send({message: "name can not be empty!"});
        return;
    } else if (!req.body.surname) {
        res.status(400).send({message: "surname can not be empty!"});
        return;
    } else if (!req.body.phone) {
        res.status(400).send({message: "phone can not be empty!"});
        return;
    } else if (!req.body.pid) {
        res.status(400).send({message: "pid can not be empty!"});
        return;
    }

    // Create a user
    const user = new User({
        // identityGuid: req.body.identityGuid,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        pid: req.body.pid,
        isPublisher: req.body.isPublisher ? req.body.isPublisher : false
    });

    // Save user in the database
    await user
        .save(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the user."
            });
        });
};

// Find a single user with an id
exports.findOne = async (req, res) => {
    const {id} = req.params;

    await User.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found user with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: "Error retrieving user with id=" + id
                });
        });
};

// Update an Ad by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const {id} = req.params;

    await User.findByIdAndUpdate(id, {
        ...req.body
    }, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update user with id=${id}. Maybe user was not found!`
                });
            } else {
                res.send({
                    message: "User was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating user with id=" + id
            });
        });
};

// Delete a user with the specified id in the request
exports.delete = async (req, res) => {
    const {id} = req.params;

    await User.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete user with id=${id}. Maybe user was not found!`
                });
            } else {
                res.send({
                    message: "User was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete user with id=" + id
            });
        });
};

// Push review into user reviews array
exports.updateReviews = async (req, res) => {
    if (!req.params) {
        return res.status(400).send({
            message: "Params can not be empty!"
        });
    }

    const {id, reviewId} = req.params;

    const user = await User.findById(id)

    if (user.isPublisher) {
        const review = await Review.findById({_id: reviewId})

        let newScore = user.score;
        if (newScore !== 0) {
            newScore = (newScore + review.score) / 2.0
        }

        const query = {
            $push: {
                reviewsIds: reviewId
            },
            score: newScore
        }

        await User.findByIdAndUpdate(id, {
            ...query
        }, {useFindAndModify: false})
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update User with id=${id}. Maybe user was not found!`
                    });
                } else {
                    res.send({
                        message: "User was updated successfully."
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating user with id=" + id
                });
            });
    } else { res.status(401).send({
        message: "Unauthorized to do this action!"
    });
}
};

// Push ad into user adsId array
exports.reserveAd = async (req, res) => {
    if (!req.params) {
        return res.status(400).send({
            message: "Params can not be empty!"
        });
    }

    const {id, adId} = req.params;

    const user = await User.findById(id)

    if (!user.isPublisher) {
        const query = {
            $push: {
                adsIds: adId
            },
        }

        await Ad.findByIdAndUpdate({_id: adId}, {$set: {taken:true}}, {useFindAndModify: false})
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating ad with id=" + id
                });
            });

        await User.findByIdAndUpdate(id, {...query}, {useFindAndModify: false})
            .then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Cannot update user with id=${id}. Maybe ad was not found!`
                    });
                } else {
                    res.send({
                        message: "User was updated successfully."
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating user with id=" + id
                });
            });
    } else { res.status(401).send({
            message: "Unauthorized to do this action!"
        });
    }
};