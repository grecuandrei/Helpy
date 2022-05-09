const Ad = require('../models/adModel');
const User = require('../models/userModel');

// Create and Save a new Ad
exports.create = async (req, res) => {
    //  Validate request
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    } else if (!req.body.publisherId) {
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
        publisherId: req.body.publisherId,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        endDate: req.body.endDate
    });

    // Save Ad in the database
    await ad
        .save(ad)
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

// Retrieve all ADs untaken from the database.
exports.findAll = async (req, res) => {
    if (!req.params) {
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    const {title} = req.query;
    const condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    await Ad.find({...condition, taken: false})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while retrieving ads."
            });
        });
};

// Retrieve all ADs taken from the database.
exports.findAllPublisher = async (req, res) => {
    if (!req.params) {
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    const {id} = req.params;
    const {title} = req.query;
    const condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    await Ad.find({...condition, publisherId: id})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while retrieving ads."
            });
        });
};

// Retrieve all ADs taken from the database for customer.
exports.findAllCustomer = async (req, res) => {
    if (!req.params) {
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    const {id} = req.params;

    await User.findById(id).populate("adsIds")
        .then(data => {
            res.send(data.adsIds);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while retrieving ads."
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
                    message: "Not found ad with id " + id
                });
            else res.send(data);
        })
        .catch(err => {
            res.status(500)
                .send({
                    message: "Error retrieving ad with id=" + id
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
                message: "Error updating ad with id=" + id
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
                    message: `Cannot delete ad with id=${id}. Maybe ad was not found!`
                });
            } else {
                res.send({
                    message: "Ad was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ad with id=" + id
            });
        });
};

// Delete all Ads from the database for publisher.
exports.deleteAll = async (req, res) => {

    // Trebuie luate intai toate adurile de la un publisher, verificate daca exista una cu true, daca nu, trb cautate in toti customerii si stersi, altfel eroare
    // await User.findByIdAndUpdate(id, {$set: {reviewsIds: []}})
    //     .catch(err => {
    //         res.status(500).send({
    //             message:
    //                 err.message
    //                 || "Some error occurred while removing all reviews."
    //         });
    //         return;
    //     });

    await Ad.deleteMany({publisherId: req.publisher.publisherId})
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
    if (!req.params) { // req.publisher
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    await Ad.findByIdAndUpdate(id, {$inc: {likes: 1}})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}

exports.unlikeAd = async (req, res) => {
    if (!req.params) { // req.publisher
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    await Ad.findOneAndUpdate({id, likes: {$gt: 0}}, {$inc: {likes: -1}})
        .then(data => {
            console.log(data)
            if (!data) {
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found or it already has 0 likes!`
                });
                return;
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}

exports.viewAd = async (req, res) => {
    if (!req.params) { // req.publisher
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    await Ad.findByIdAndUpdate(id, {$inc: {views: 1}})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}