const router = require("express").Router();
const reviews = require("../controllers/reviewController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, reviews.create);
    router.delete("/:id", checkJwt, reviews.deleteOne);
    app.use('/api/reviews', router);
};