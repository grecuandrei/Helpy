const router = require("express").Router();
const users = require("../controllers/userController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    // router.post("/", checkJwt, users.create);
    // router.get("/:id", users.findOne);
    // router.put("/:id", checkJwt, users.update);
    // router.delete("/:id", checkJwt, users.delete);
    // router.patch("/:id/:reviewId", checkJwt, users.updateReviews); // updates the score as well
    // router.patch("/:id/:adId", checkJwt, users.reserveAd); // takes an ad as well
    router.post("/", users.create);
    router.get("/:id", users.findOne);
    router.get("/guid/:guid", users.findByGuid); // find user by guid
    router.put("/:guid", checkJwt, users.update);
    router.delete("/:id", users.delete);
    router.patch("/review/:id/:reviewId", users.updateReviews); // updates the score as well
    router.patch("/ad/:guid/:adId", users.reserveAd); // takes an ad as well
    app.use('/api/users', router);
};