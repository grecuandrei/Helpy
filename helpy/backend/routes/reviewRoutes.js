const router = require("express").Router();
const reviews = require("../controllers/reviewController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, reviews.create);
    router.get("/:id", reviews.findAllForUser);
    router.delete("/", checkJwt, reviews.deleteAll);
    app.use('/api/reviews', router);
};