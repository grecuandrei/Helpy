const router = require("express").Router();
const reviews = require("../controllers/reviewController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    // router.post("/", checkJwt, reviews.create);
    // router.delete("/:id", checkJwt, reviews.deleteAll);
    router.post("/", reviews.create);
    router.delete("/:id", reviews.deleteAll);
    app.use('/api/reviews', router);
};