const router = require("express").Router();
const users = require("../controllers/userController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, users.create);
    router.get("/:id", users.findOne);
    router.get("/guid/:guid", users.findByGuid); // find user by guid
    router.put("/:id", checkJwt, users.update);
    router.delete("/:id", checkJwt, users.delete);
    router.patch("/review/:id/:reviewId", checkJwt, users.updateReviews); // updates the score as well
    router.patch("/ad/:guid/:adId/:isPublisher", checkJwt, users.reserveAd); // takes an ad as well
    app.use('/api/users', router);
};