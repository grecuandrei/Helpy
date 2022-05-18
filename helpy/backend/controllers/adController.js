const Ad = require('../models/adModel');
const KeywordService = require('../services/keywordsServices');
const AdService = require('../services/adServices');

// Create and Save a new Ad
exports.create = async (req, res) => {
    let message;

    //  Validate request
    if (!req.body.title) {
        message = "title can not be empty!";
    } else if (!req.body.publisherId) {
        message = "publisherId can not be empty!";
    } else if (!req.body.description) {
        message = "description can not be empty!";
    } else if (!req.body.address) {
        message = "address can not be empty!";
    } else if (!req.body.endDate) {
        message = "endDate can not be empty!";
    } else if (!req.body.keywords) {
        message = "keywords can not be empty!";
    }

    if (message) {
        console.log('[AdController][Create][Error]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    let keywords = []
    // Create keywords if they dont exist
    for (const keyword of req.body.keywords) {
        try {
            const result = await KeywordService.saveKeyword(keyword)
            if (result) {
                keywords.push(result._id)
                console.log('[AdController][Create][INFO]:' + ' keyword: ' + keyword + ' was sucessfully added');
            }
        } catch (err) {
            console.log('[AdController][Create][ERROR]:' + " Some error occurred while creating the keyword.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while creating the keyword."
            });
        }
    }

    // Create a Ad
    const ad = new Ad({
        publisherId: req.body.publisherId,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        endDate: req.body.endDate,
        keywords: keywords
    });

    // Save Ad in the database
    try {
        const result = await AdService.saveAd(ad)
        console.log('[AdController][Create][INFO]:' + ' ad: ' + title + ' was sucessfully published by: ' + req.body.publisherId);
        res.status(201).send(result);
    } catch (err) {
        console.log('[AdController][Create][ERROR]:' + " Some error occurred while creating the ad.");
        res.status(500).send({
            message:
                err.message
                || "Some error occurred while creating the ad."
        });
    }
};

// Find a single AD with an id
exports.findOne = async (req, res) => {
    if (!req.params.id) {
        console.log( '[AdController][FindOne][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {id} = req.params;

    try {
        const ad = await AdService.findOne(id)
        if (!ad) {
            res.status(404).send({
                message: "Not found ad with id " + id
            });
            console.log('[AdController][FindOne][ERROR]:' + " invalid ad id (%s).", id);
        }
        else {
            console.log('[AdController][FindOne][INFO]:' + " ad with id (%s) was returned.", id);
            res.status(200).send(ad);
        }
    } catch(err) {
        console.log('[AdController][FindOne][ERROR]:' + " Error retrieving ad with id: " + id);
        res.status(500)
            .send({
                message: "Error retrieving ad with id=" + id
            });
    }
};

// Retrieve all ADs untaken from the database based on title and/or array of keywords.
exports.findAll = async (req, res) => {
    const {title, keywords} = req.query;

    try {
        const ads = await AdService.findAll(title, keywords)
        console.log('[AdController][FindAll][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][FindAll][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};

// Retrieve all ADs from the database.
exports.findAllPublisher = async (req, res) => {
    if (!req.params.id) {
        console.log( '[AdController][FindAllPublisher][Error]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {guid} = req.params;
    const {title, keywords} = req.query;

    try {
        const ads = await AdService.findAllPublisher(title, keywords, guid)
        console.log('[AdController][FindAllPublisher][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][FindAllPublisher][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};

// Retrieve all ADs taken from the database for customer.
exports.findAllCustomer = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][FindAllCustomer][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    const {guid} = req.params;
    const {keywords} = req.query;

    try {
        const ads = await AdService.findAllCustomer(keywords, guid)
        console.log('[AdController][FindAllCustomer][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][FindAllCustomer][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};

// Update an Ad by the id in the request
exports.update = async (req, res) => {
    let message;
    if (!req.body) {
        message = "Data to update can not be empty!"
    } else if (!req.params.id) {
        message = "Params can not be empty!"
    }

    if (message) {
        console.log('[AdController][Update][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    const {id} = req.params;

    try {
        const result = await AdService.updateAd(id, req.body)
        if (!result) {
            console.log('[AdController][Update][ERROR]: ' + `Cannot update Ad with id=${id}. Maybe Ad was not found!`);
            res.status(404).send({
                message: `Cannot update Ad with id=${id}. Maybe Ad was not found!`
            });
        } else {
            console.log('[AdController][Update][INFO]: ' + "Ad was updated successfully.");
            res.status(200).send({
                message: "Ad was updated successfully."
            });
        }
    } catch(err) {
        console.log('[AdController][Update][ERROR]: ' + "Error updating ad with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Error updating ad with id=" + id
        });
    }
};

// Delete a Ad with the specified id in the request
exports.delete = async (req, res) => {
    let message;
    if (!req.params.id) {
        message = "Params can not be empty!"
    }

    if (message) {
        console.log('[AdController][Delete][ERROR]:' + ' ' + message);
        res.status(400).send({message: message});
        return;
    }

    const {id} = req.params;

    try {
        const result = await AdService.deleteAd(id)
        if (!result) {
            console.log('[AdController][Delete][ERROR]: ' + `Cannot delete ad with id=${id}. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot delete ad with id=${id}. Maybe ad was not found!`
            });
        } else {
            console.log('[AdController][Delete][Info]: ' + "Ad was deleted successfully!");
            res.status(200).send({
                message: "Ad was deleted successfully!"
            });
        }
    } catch (err) {
        console.log('[AdController][Delete][ERROR]: ' + "Could not delete ad with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Could not delete ad with id=" + id
        });
    }
};

exports.likeAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][LikeAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    const query = {$inc: {likes: 1}}

    try {
        const result = await AdService.updateAd(id, query)
        if (!result) {
            console.log('[AdController][LikeAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot update ad with id=${id}. Maybe ad was not found!`
            });
        } else {
            console.log('[AdController][LikeAd][INFO]: ' + "Ad was sucessfully updated!");
            res.status(200).send({
                message: "Ad was updated successfully."
            });
        }
    } catch(err) {
        console.log('[AdController][LikeAd][ERROR]: ' + "Could not update ad with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Error updating ad with id=" + id
        });
    }
}

exports.unlikeAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][UnlikeAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    const query = {$inc: {likes: -1}}

    try {
        const result = await AdService.unlikeAd(id, query)
        if (!result) {
            console.log('[AdController][UnlikeAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found or it already has 0 likes!`);
                res.status(404).send({
                message: `Cannot update ad with id=${id}. Maybe ad was not found!`
            });
        } else {
            console.log('[AdController][UnlikeAd][INFO]: ' + "Ad was sucessfully updated!");
            res.status(200).send({
                message: "Ad was updated successfully."
            });
        }
    } catch(err) {
        console.log('[AdController][UnlikeAd][ERROR]: ' + "Could not update ad with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Error updating ad with id=" + id
        });
    }
}

exports.viewAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][ViewAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    const query = {$inc: {views: 1}}

    try {
        const result = await AdService.updateAd(id, query)
        if (!result) {
            console.log('[AdController][ViewAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found!`);
            res.status(404).send({
                message: `Cannot update ad with id=${id}. Maybe ad was not found!`
            });
        } else {
            console.log('[AdController][ViewAd][INFO]: ' + "Ad was sucessfully retrieved!");
            res.status(200).send({
                message: "Ad was updated successfully."
            });
        }
    } catch(err) {
        console.log('[AdController][ViewAd][ERROR]: ' + "Could not update ad with id: " + id);
        res.status(500).send({
            message:
                err.message
                || "Error updating ad with id=" + id
        });
    }
}