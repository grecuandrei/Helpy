const router = require("express").Router();
const users = require("../controllers/userController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/", checkJwt, users.create);
    router.get("/:id", users.findOne);
    router.get("/guid/:guid", users.findByGuid); // find user by guid
    router.get("/findCustomer/:id", users.findCustomerFromAd); // find customer with this adid
    router.put("/:id", checkJwt, users.update);
    router.delete("/:guid/:isPublisher", checkJwt, users.delete);
    router.patch("/ad/:guid/:adId/:isPublisher", checkJwt, users.reserveAd); // takes an ad as well
    app.use('/api/users', router);
};