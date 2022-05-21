const Ad = require('../models/adModel');
const KeywordService = require('../services/keywordsServices');
const AdService = require('../services/adServices');
const UserService = require('../services/userServices');

// Create and Save a new Ads
exports.create = async (req, res) => {
    let message;

    //  Validate request
    if (!req.body.title) {
        message = "title can not be empty!";
    } else if (!req.params.guid) {
        message = "publisherGuid can not be empty!";
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

    const user = await UserService.findOneByGuid(req.params.guid)

    // Create a Ad
    const ad = new Ad({
        publisherId: user.id,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        endDate: new Date(req.body.endDate),
        keywords: keywords
    });

    // Save Ad in the database
    try {
        const result = await AdService.saveAd(ad)
        console.log('[AdController][Create][INFO]:' + ' ad: ' + req.body.title + ' was sucessfully published by: ' + user.name);
        res.status(201).send(result);
    } catch (err) {
        console.log('[AdController][Create][ERROR]:' + " Some error occurred while creating the ad.");
        console.log(err)
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
    const {keywords} = req.query;

    try {
        const ads = await AdService.findAll(keywords)
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

// Retrieve all ADs for publisher
exports.findAllPublisher = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][FindAllPublisher][Error]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {guid} = req.params;

    try {
        const ads = await AdService.findAllPublisher(guid)
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

// Retrieve all ADs taken for publisher
exports.findAllPublisherTaken = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][FindAllPublisherTaken][Error]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {guid} = req.params;

    try {
        const ads = await AdService.findAllPublisherTaken(guid)
        console.log('[AdController][FindAllPublisherTaken][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][FindAllPublisherTaken][ERROR]:' + " Error retrieving ads");
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

    let keywords = []
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
    req.body.keywords = keywords

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
        console.log(err)
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

exports.topXLiked = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][TopXLiked][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    if (!req.params.x) {
        console.log( '[AdController][TopXLiked][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {x, guid} = req.params;

    try {
        const ads = await AdService.topXLiked(x, guid)
        console.log('[AdController][TopXLiked][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][TopXLiked][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};

exports.topXViewed = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][TopXViewed][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    if (!req.params.x) {
        console.log( '[AdController][TopXViewed][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {x, guid} = req.params;

    try {
        const ads = await AdService.topXViewed(x, guid)
        console.log('[AdController][TopXViewed][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log('[AdController][TopXViewed][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};

exports.topViewedKeyword = async (req, res) => {
    if (!req.params.guid) {
        console.log( '[AdController][TopViewedKeyword][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    if (!req.params.keyword) {
        console.log( '[AdController][TopViewedKeyword][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {keyword, guid} = req.params;

    try {
        const ads = await AdService.topViewedKeyword(keyword, guid)
        console.log('[AdController][TopViewedKeyword][INFO]:' + " Ads were succesfully returned");
        res.status(200).send(ads);
    } catch (err) {
        console.log(err)
        console.log('[AdController][TopViewedKeyword][ERROR]:' + " Error retrieving ads");
        res.status(500).send({
            message:
                err.message
                || "Error retrieving ads"
        });
    }
};