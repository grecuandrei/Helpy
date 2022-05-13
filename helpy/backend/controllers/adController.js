const Ad = require('../models/adModel');
const User = require('../models/userModel');
const Keywords = require('../models/keywordModel');

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
        var query = {name: keyword.toLowerCase()},
        update = {},
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const result = await Keywords.findOneAndUpdate(query, update, options).exec();
        if (result) {
            keywords.push(result._id)
            console.log('[AdController][Create][INFO]:' + ' keyword: ' + keyword + ' was sucessfully added');
        } else {
            res.status(500).send({
                message:
                    error.message
                    || "Some error occurred while creating the ad."
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
    await ad
        .save(ad)
        .then(data => {
            console.log('[AdController][Create][INFO]:' + ' ad: ' + title + ' was sucessfully published by: ' + req.body.publisherId);
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

// Retrieve all ADs untaken from the database based on title and/or array of keywords.
exports.findAll = async (req, res) => {
    // if (!req.params) {
    //     console.log( '[AdController][FindAll][Error]:' + 'Params can not be empty!');
    //     res.status(400).send({message: "Params can not be empty!"});
    //     return;
    // }
    const {title, keywords} = req.query;

    let condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};
    
    const keywordsName = JSON.parse(keywords)
    const keywordsIds = JSON.stringify(keywordsName) !== JSON.stringify([]) ? await Keywords.find({name: {$in: keywordsName}}, {_id: 1}).exec() : undefined;
    condition = keywordsIds ? {...condition, 'keywords': {$all: keywordsIds}} : condition

    await Ad.find({...condition, taken: false}).populate('keywords', 'name')
        .then(data => {
            console.log('[AdController][FindAll][INFO]: ' + ' requested ads were returned');
            res.status(200).send(data);
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
        console.log( '[AdController][FindAllPublisher][Error]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {id} = req.params;
    const {title} = req.query;
    const condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    await Ad.find({...condition, publisherId: id})
        .then(data => {
            console.log('[AdController][FindAllPublisher][INFO]' + id + '\'s' + " ads were returned.");
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
        console.log( '[AdController][FindAllCustomer][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }
    const {guid} = req.params;
    const {keywords} = req.query;

    console.log(keywords)

    await User.findOne({guid: guid})
    .populate({
        path : 'adsIds',
            populate : {
                path : 'keywords'
            }
    })
        .then(data => {
            console.log('[AdController][FindAllCustomer][INFO]:' + guid + '\'s' + " ads were returned.");
            if (keywords === '[]') {
                res.send(data.adsIds)
                return;
            }
            let ads = []
            const keywordsName = JSON.parse(keywords)
            for (let ad of data.adsIds) {
                if (keywordsName.every(element => {return ad.keywords.map(a => a.name).includes(element);})) {
                    ads.push(ad)
                }
            }
            res.send(ads);
        })
        .catch(err => {
            console.log('[AdController][FindAllCustomer][ERROR]:' + "Some error occurred while retrieving ads.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while retrieving ads."
            });
        });
};

// Find a single AD with an id
exports.findOne = async (req, res) => {
    if (!req.params) {
        console.log( '[AdController][FindOne][ERROR]:' + 'Params can not be empty!');
        res.status(400).send({message: "Params can not be empty!"});
        return;
    }

    const {id} = req.params;

    await Ad.findById(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: "Not found ad with id " + id
                });
                console.log('[AdController][FindOne][ERROR]:' + " invalid ad id (%s).", id);
            }
            else {
                console.log('[AdController][FindOne][INFO]:' + " ad with id (%s) was returned.", id);
                res.send(data);
            }
        })
        .catch(err => {
            console.log('[AdController][FindOne][ERROR]:' + "Error retrieving ad with id: " + id);
            res.status(500)
                .send({
                    message: "Error retrieving ad with id=" + id
                });
        });
};

// Update an Ad by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        console.log('[AdController][Update][ERROR]: ' + 'Data to update can not be empty!');
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
                console.log('[AdController][Update][ERROR]: ' + `Cannot update Ad with id=${id}. Maybe Ad was not found!`);
                res.status(404).send({
                    message: `Cannot update Ad with id=${id}. Maybe Ad was not found!`
                });
            } else {
                console.log('[AdController][Update][INFO]: ' + "Ad was updated successfully.");
                res.send({
                    message: "Ad was updated successfully."
                });
            }
        })
        .catch(err => {
            console.log('[AdController][Update][ERROR]: ' + "Error updating ad with id: " + id);
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
                console.log('[AdController][Delete][ERROR]: ' + `Cannot delete ad with id=${id}. Maybe ad was not found!`);
                res.status(404).send({
                    message: `Cannot delete ad with id=${id}. Maybe ad was not found!`
                });
            } else {
                console.log('[AdController][Delete][Info]: ' + "Ad was deleted successfully!");
                res.send({
                    message: "Ad was deleted successfully!"
                });
            }
        })
        .catch(err => {
            console.log('[AdController][Delete][ERROR]: ' + "Could not delete ad with id: " + id);
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
                console.log('[AdController][DeleteAll][INFO]: ' + `${data.deletedCount} Ads were deleted successfully!`);
                res.send({
                    message: `${data.deletedCount} Ads were deleted successfully!`
                });
            }
        })
        .catch(err => {
            console.log('[AdController][DeleteAll][ERROR]: ' + "Some error occurred while removing all Ads.");
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all Ads."
            });
        });
};


exports.likeAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][LikeAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    await Ad.findByIdAndUpdate(id, {$inc: {likes: 1}})
        .then(data => {
            if (!data) {
                console.log('[AdController][LikeAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found!`);
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                });
            }
            console.log('[AdController][LikeAd][INFO]: ' + "Ad was sucessfully updated!");
            res.status(200).json(data);
        })
        .catch(err => {
            console.log('[AdController][LikeAd][ERROR]: ' + "Could not update ad with id: " + id);
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}

exports.unlikeAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][UnlikeAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    await Ad.findOneAndUpdate({id, likes: {$gt: 0}}, {$inc: {likes: -1}})
        .then(data => {
            console.log(data)
            if (!data) {
                console.log('[AdController][UnlikeAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found or it already has 0 likes!`);
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found or it already has 0 likes!`
                });
                return;
            }
            console.log('[AdController][UnlikeAd][INFO]: ' + "Ad was sucessfully updated!");
            res.status(200).json(data);
        })
        .catch(err => {
            console.log('[AdController][UnlikeAd][ERROR]: ' + "Could not update ad with id: " + id);
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}

exports.viewAd = async (req, res) => {
    if (!req.params) { // req.publisher
        console.log('[AdController][ViewAd][ERROR]: ' + "Client is not authenticated!");
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    console.log(id)

    await Ad.findByIdAndUpdate(id, {$inc: {views: 1}})
        .then(data => {
            if (!data) {
                console.log('[AdController][ViewAd][ERROR]: ' + `Cannot update ad with id=${id}. Maybe ad was not found!`);
                res.status(404).send({
                    message: `Cannot update ad with id=${id}. Maybe ad was not found!`
                });
            }
            res.status(200).json(data);
            console.log('[AdController][ViewAd][INFO]: ' + "Ad was sucessfully retrieved!");
        })
        .catch(err => {
            console.log('[AdController][ViewAd][ERROR]: ' + "Could not update ad with id: " + id);
            res.status(500).send({
                message: "Could not update ad with id=" + id
            });
        });
}