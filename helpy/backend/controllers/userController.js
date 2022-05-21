const User = require('../models/userModel');
const UserService = require('../services/userServices');


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
    } else if (!req.body.isPublisher) {
        message = "isPublisher can not be empty!";
    }

    if (message) {
        console.log('[UserController][Create][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    // Asign publisher role
    if (req.body.isPublisher == true) {
        try {
            await UserService.assignRole(req.body.guid)
        } catch(err) {
            console.log('[UserController][Create][ERROR]:' + ' ' + "Some error occurred while assigning publisher role.");
            console.log(err)
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
        isPublisher: req.body.isPublisher
    });

    // Save user in the database
    try {
        const result = await UserService.saveUser(user)
        console.log('[UserController][Create][INFO]:' + ' ' + 'User was sucessfully added!');
        res.status(201).send(result);
    } catch(err) {
        console.log(err)
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
        const result = await UserService.updateUserByGuid(id, req.body)
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
    const {guid, isPublisher} = req.params;

    if (!guid) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "req.params.guid cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }
    if (!isPublisher) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "req.params.isPublisher cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const result = await UserService.deleteUser(guid, isPublisher)
        if (!result) {
            console.log('[UserController][Delete][ERROR]:' + ' ' + `Cannot delete user with guid=${guid}. Maybe user was not found!`);
            res.status(404).send({
                message: `Cannot delete user with guid=${guid}. Maybe user was not found!`
            });
        } else {
            console.log('[UserController][Delete][INFO]:' + ' ' + "User was deleted successfully!");
            res.status(200).send({
                message: "User was deleted successfully!"
            });
        }
    } catch(err) {
        console.log('[UserController][Delete][ERROR]:' + ' ' + "Could not delete user with guid: " + guid);
        res.status(500).send({
            message:
                err.message
                || "Could not delete user with guid: " + guid
        });
    }
};

// find a customer based on an ad
exports.findCustomerFromAd = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        console.log('[UserController][FindCustomerFromAd][ERROR]:' + ' ' + "req.params cannot be empty");
        res.status(400).send({
            message: "Bad request"
        });
    }

    try {
        const result = await UserService.findCustomerFromAd(id)
        if (!result) {
            console.log('[UserController][FindCustomerFromAd][ERROR]:' + ' ' + `Cannot retrieve user with adid=${id}. Maybe user was not found!`);
            res.status(404).send({
                message: `Cannot retrieve user with adid=${id}. Maybe user was not found!`
            });
        } else {
            console.log('[UserController][findCustomerFromAd][INFO]:' + ' ' + "User was found successfully!");
            res.status(200).send(result);
        }
    } catch(err) {
        console.log('[UserController][FindCustomerFromAd][ERROR]:' + ' ' + "Could not retriev user with adid: " + id);
        res.status(500).send({
            message:
                err.message
                || `Cannot retrieve user with adid=${id}. Maybe user was not found!`
        });
    }
};

// Reserve ad
exports.reserveAd = async (req, res) => {
    let message;
    if (!req.params.guid) {
        message = "req.params.guid can not be empty!"
    } else if (!req.params.adId) {
        message = "req.params.adId can not be empty!"
    } else if (!req.params.isPublisher) {
        message = "req.params.adId can not be empty!"
    }

    if (message) {
        console.log('[UserController][ReserveAd][ERROR]:' + ' ' + message);
        return res.status(400).send({
            message: message
        });
    }

    const {guid, adId, isPublisher} = req.params;

    try {
        const result = await UserService.reserveAd(guid, adId, isPublisher)
        if (!result) {
            console.log('[UserController][ReserveAd][ERROR]:' + ' ' + `Cannot reserve ad with adId=${adId}. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot reserve ad with adId=${adId}. Maybe ad was not found!`
            });
        } else {
            console.log('[UserController][ReserveAd][INFO]:' + ' ' + "Ad was reserved successfully.");
            res.status(200).send({
                message: "Ad was reserved successfully."
            });
        }
    } catch(err) {
        console.log('[UserController][ReserveAd][ERROR]:' + ' ' + "Could not reserve ad with id: " + adId);
        res.status(500).send({
            message:
                err.message
                || "Could not reserve ad with id: " + adId
        });
    }
};