const fs = require("fs");
const Ad = require('../models/adModel');

// Create and Save a new Ad
exports.create = (req, res) => {
    //  Validate request
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    } else if (!req.body.description) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    } else if (!req.body.address) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    } else if (!req.body.endDate) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }

    // Create a Ad
    const ad = new Ad({
        publisherId: req.user.publisherId,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        endDate: req.body.endDate
    });

    // Save Ad in the database
    post
        .save(post)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the ad."
            });
        });
};

// Retrieve all ADs from the database.
exports.findAll = async (req, res) => {
    const {title} = req.query;
    const condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    await Ad.find(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while retrieving posts."
            });
        });
};

// Find a single AD with an id
exports.findOne = async (req, res) => {
    const {id} = req.params;

    await Ad.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({
                    message: "Not found post with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: "Error retrieving Post with id=" + id
                });
        });
};

// Update a Ad by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const {id} = req.params;

    await Ad.findByIdAndUpdate(id, {
        ...req.body
    }, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Ad with id=${id}. Maybe Ad was not found!`
                });
            } else {
                res.send({
                    message: "Ad was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating post with id=" + id
            });
        });
};

// Delete a Ad with the specified id in the request
exports.delete = async (req, res) => {
    const {id} = req.params;

    await Ad.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete post with id=${id}. Maybe post was not found!`
                });
            } else {
                res.send({
                    message: "Post was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete post with id=" + id
            });
        });
};

// Delete all Ads from the database for publisher.
exports.deleteAll = async (req, res) => {
    await Ad.deleteMany({publisher: req.user.email})
        .then(data => {
            if (data) {
                res.send({
                    message: `${data.deletedCount} Ads were deleted successfully!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all Ads."
            });
        });
};


exports.likeAd = async (req, res) => {
    if (!req.user) {
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    const ad = await Ad.findById(id)
        .catch(err => {
            res.status(500)
                .send({
                    message: "Error retrieving Ad with id=" + id
                });
        });

    const index = ad.likes.findIndex((id) => id === String(req.user.email));

    if (index === -1) {
        ad.likes.push(req.user.email);
    } else {
        ad.likes = post.likes.filter((id) => id !== String(req.user.email));
    }

    await Ad.findByIdAndUpdate(id, ad, {new: true})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete ad with id=${id}. Maybe post was not found!`
                });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ad with id=" + id
            });
        });

}

exports.viewAd = async (req, res) => {
    res.status(200)
}