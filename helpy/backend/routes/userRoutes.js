const router = require("express").Router();
const users = require("../controllers/userController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, users.create);
    router.get("/:id", users.findOne);
    router.delete("/:id", checkJwt, users.delete);
    router.patch("/:id", checkJwt, users.updateReviews); // updates the score as well
    router.patch("/:id", checkJwt, users.updateAds);
    app.use('/api/users', router);
};