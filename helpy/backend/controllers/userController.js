const fs = require("fs");
const User = require('../models/userModel');

// Create and Save a new Ad
exports.create = (req, res) => {
    //  Validate request
    if (!req.body.identityGuid) {
        res.status(400).send({message: "identityGuid can not be empty!"});
        return;
    } else if (!req.body.email) {
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
    } else if (!req.body.isPublisher) {
        res.status(400).send({message: "isPublisher can not be empty!"});
        return;
    }

    // Create a user
    const user = new User({
        identityGuid: req.user.identityGuid,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        phone: req.body.phone,
        pid: req.body.pid,
        isPublisher: req.body.isPublisher
    });

    // Save user in the database
    User
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