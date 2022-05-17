const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Ad = require('../models/adModel');
const ads = require("../controllers/adController.js");
const UserService = require('../services/userServices');

require('dotenv').config();
const domain = process.env.AUTH0_DOMAIN;
const client_id = process.env.AUTH0_CLIENT_ID;
const client_secret = process.env.AUTH0_CLIENT_SECRET;
const admin_role = process.env.AUTH0_ADMIN_ROLE_ID;
const ManagementClient = require("auth0").ManagementClient;

// Create and Save a new User
exports.create = async (req, res) => {
    //  Validate request
    let message;
    if (!req.body.guid) {
        message = "guid can not be empty!";
    } else if (!req.body.email) {
        message =  "email can not be empty!";
    } else if (!req.body.name) {
        message = "name can not be empty!";
    } else if (!req.body.surname) {
        message = "surname can not be empty!";
    } else if (!req.body.phone) {
        message = "phone can not be empty!";
    } else if (!req.body.pid) {
        message = "pid can not be empty!";
    }

    if (message) {
        console.log('[UserController][Create][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    // Asign publisher role
    if (req.body.isPublisher && req.body.isPublisher == true) {
        try {
            await UserService.assignRole(req.body.guid)
        } catch(err) {
            console.log('[UserController][Create][ERROR]:' + ' ' + "Some error occurred while assigning publisher role.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the user."
            });
        }
    }

    // Create a user
    const user = new User({
        guid: req.body.guid,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        pid: req.body.pid,
        isPublisher: req.body.isPublisher ? req.body.isPublisher : false
    });

    // Save user in the database
    try {
        const result = await UserService.saveUser(user)
        console.log('[UserController][Create][INFO]:' + ' ' + 'User was sucessfully added!');
        res.status(201).send(result);
    } catch(err) {
        console.log('[UserController][Create][ERROR]:' + ' ' + "Some error occurred while creating the user.");
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while creating the user."
        });
    }
};

// Find a single user with an id
exports.findOne = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await UserService.findOne(id)
        if (!user) {
            console.log('[UserController][FindOne][ERROR]:' + ' ' + "Not found user with id: " + id);
            res.status(404).send({
                message: "Not found user with id " + id
            });
        }
        else {
            console.log('[UserController][FindOne][INFO]:' + ' ' + 'User was suvessfully returned!');
            res.status(200).send(user);
        }
    } catch(err) {
        console.log('[UserController][FindOne][ERROR]:' + ' ' + "Error retrieving user with id: " + id);
        res.status(500)
            .send({
                message:
                    err.message
                    || "Error retrieving user with id=" + id
            });
    }
};

// Find a single user with an guid
exports.findByGuid = async (req, res) => {
    const {guid} = req.params;

    if (!guid) {
        console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "req.params cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const user = await UserService.findOneByGuid(guid)
        if (!user) {
            console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "Not found user with guid: " + guid);
            res.status(404).send({
                message: "Not found user with guid " + guid
            });
        }
        else {
            console.log('[UserController][FindByGuid][INFO]:' + ' ' + 'User was suvessfully returned!');
            res.status(200).send(user);
        }
    } catch(err) {
        console.log('[UserController][FindByGuid][ERROR]:' + ' ' + "Error retrieving user with guid: " + guid);
        res.status(500)
            .send({
                message:
                    err.message
                    || "Error retrieving user with guid=" + guid
            });
    }
};

// Update an User by the guid in the request
exports.update = async (req, res) => {
    const {id} = req.params;

    let message;

    if (!req.body) {
        message = "Data to update can not be empty!"
    } else if (!id) {
        message = "req.params can not be empty!"
    }

    if (message) {
        console.log('[UserController][Update][ERROR]:' + ' ' + message);
        return res.status(400).send({
            message: message
        });
    }

    try {
        const result = await UserService.updateUser(id, req.body)
        if (!result) {
            console.log('[UserController][Update][ERROR]:' + ' ' + `Cannot update user with id=${id}. Maybe user was not found!`);
            res.status(404).send({
                message: `Cannot update user with id=${id}. Maybe user was not found!`
            });
        } else {
            console.log('[UserController][Update][INFO]:' + ' ' + "User was updated successfully.");
            res.status(200).send({
                message: "User was updated successfully."
            });
        }
    } catch(err) {
        console.log('[UserController][Update][ERROR]:' + ' ' + "Error updating user with id: " + id);
            res.status(500).send({
                message:
                    err.message
                    || "Error updating user with id=" + id
            });
    }
};

// Delete a user with the specified id in the request
exports.delete = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "req.params cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const result = await UserService.deleteUser(id)
        if (!result) {
            console.log('[UserController][Delete][ERROR]:' + ' ' + `Cannot delete user with id=${id}. Maybe user was not found!`);
            res.status(404).send({
                message: `Cannot delete user with id=${id}. Maybe user was not found!`
            });
        } else {
            console.log('[UserController][Delete][INFO]:' + ' ' + "User was deleted successfully!");
            res.send({
                message: "User was deleted successfully!"
            });
        }
    } catch(err) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "Could not delete user with id: " + id);
        res.status(500).send({
            message: "Could not delete user with id=" + id
        });
    }
};

// Push review into user reviews array
exports.updateReviews = async (req, res) => {
    if (!req.params) {
        console.log('[UserController][UpdateReviews][ERROR]:' + ' ' + "Params can not be empty!");
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
                    console.log('[UserController][UpdateReviews][ERROR]:' + ' ' + `Cannot update User with id=${id}. Maybe user was not found!`);
                    res.status(404).send({
                        message: `Cannot update User with id=${id}. Maybe user was not found!`
                    });
                } else {
                    console.log('[UserController][UpdateReviews][INFO]:' + ' ' + "User was updated successfully.");
                    Ad.findByIdAndUpdate({_id:reviewId}, {reviewed: true}) // TODO test this
                    res.status(200).send({
                        message: "User was updated successfully."
                    });
                }
            })
            .catch(err => {
                console.log('[UserController][UpdateReviews][ERROR]:' + ' ' + "Error updating user with id: " + id);
                res.status(500).send({
                    message: "Error updating user with id=" + id
                });
            });
    } else { 
        console.log('[UserController][UpdateReviews][ERROR]:' + ' ' + "Unauthorized to do this action!");
        res.status(401).send({
        message: "Unauthorized to do this action!"
    });
}
};

// Push ad into user adsId array
exports.reserveAd = async (req, res) => {
    if (!req.params) {
        console.log('[UserController][ReserveAd][ERROR]:' + ' ' + "Params can not be empty!");
        return res.status(400).send({
            message: "Params can not be empty!"
        });
    }

    const {guid, adId} = req.params;

    const user = await User.findOne({guid: guid})

    if (!user.isPublisher) {
        const query = {
            $push: {
                adsIds: adId
            },
        }

        await Ad.findByIdAndUpdate({_id: adId}, {$set: {taken:true}}, {useFindAndModify: false})
            .then(data => {
                if (!data) {
                    console.log('[UserController][ReserveAd][ERROR]:' + ' ' + `Cannot update ad with id=${id}. Maybe ad was not found!`);
                    res.status(404).send({
                        message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                    });
                }
            })
            .catch(err => {
                console.log('[UserController][ReserveAd][ERROR]:' + ' ' + "Error updating ad with id: " + id);
                res.status(500).send({
                    message: "Error updating ad with id=" + id
                });
            });

        await User.findOneAndUpdate({guid: guid}, {...query}, {useFindAndModify: false})
            .then(data => {
                if (!data) {
                    console.log('[UserController][ReserveAd][ERROR]:' + ' ' + `Cannot update user with id=${id}. Maybe ad was not found!`);
                    res.status(404).send({
                        message: `Cannot update user with id=${id}. Maybe ad was not found!`
                    });
                } else {
                    console.log('[UserController][ReserveAd][INFO]:' + ' ' + "User was updated successfully.");
                    res.send({
                        message: "User was updated successfully."
                    });
                }
            })
            .catch(err => {
                console.log('[UserController][ReserveAd][ERROR]:' + ' ' + "Error updating user with id: " + id);
                res.status(500).send({
                    message: "Error updating user with id=" + id
                });
            });
    } else { 
        console.log('[UserController][ReserveAd][ERROR]:' + ' ' + "Unauthorized to do this action!");
        res.status(401).send({
            message: "Unauthorized to do this action!"
        });
    }
};