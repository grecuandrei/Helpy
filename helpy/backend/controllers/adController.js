const fs = require("fs");
const Ad = require('../models/adModel');

// Create and Save a new Post
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

    // Create a Post
    const ad = new Ad({
        publisherId: req.user.publisherId,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        endDate: req.body.endDate
    });

    // Save Post in the database
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

// Retrieve all Posts from the database.
exports.findAll = async (req, res) => {
    const {title} = req.query;
    const condition = title ? {title: {$regex: new RegExp(title), $options: "i"}} : {};

    await Post.find(condition)
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

// Find a single Post with an id
exports.findOne = async (req, res) => {
    const {id} = req.params;

    await Post.findById(id)
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

// Update a Post by the id in the request
exports.update = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }

    const {id} = req.params;

    await Post.findByIdAndUpdate(id, {
        ...req.body,
        image: (req.file ? req.file.filename : req.body.currentImg)
    }, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Post with id=${id}. Maybe Post was not found!`
                });
            } else {
                if (req.file && req.body.currentImg)
                    fs.unlinkSync("./uploads/" + req.body.currentImg);
                res.send({
                    message: "Post was updated successfully."
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating post with id=" + id
            });
        });
};

// Delete a Post with the specified id in the request
exports.delete = async (req, res) => {
    const {id} = req.params;

    await Post.findByIdAndRemove(id)
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

// Delete all Posts from the database.
exports.deleteAll = async (req, res) => {
    await Post.deleteMany({creator: req.user.email})
        .then(data => {
            if (data) {
                fs.rm("./uploads/", {recursive: true}, () => fs.mkdirSync("./uploads/"));
                res.send({
                    message: `${data.deletedCount} Post were deleted successfully!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message
                    || "Some error occurred while removing all posts."
            });
        });
};


exports.likeAd = async (req, res) => {
    if (!req.user) {
        return res.json({message: "Unauthenticated"});
    }

    const {id} = req.params;

    const post = await Post.findById(id)
        .catch(err => {
            res.status(500)
                .send({
                    message: "Error retrieving Post with id=" + id
                });
        });

    const index = post.likes.findIndex((id) => id === String(req.user.email));

    if (index === -1) {
        post.likes.push(req.user.email);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.user.email));
    }

    await Post.findByIdAndUpdate(id, post, {new: true})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete post with id=${id}. Maybe post was not found!`
                });
            }
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete post with id=" + id
            });
        });

}