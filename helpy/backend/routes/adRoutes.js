const router = require("express").Router();
const ads = require("../controllers/adController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    // router.post("/", checkJwt, ads.create);
    // router.get("/", ads.findAll); // these are all ads untaken
    // router.get("/customer/:id", ads.findAllCustomer); // these are all ads taken by customer
    // router.get("/publisher/:id", ads.findAllPublisher); // all ads for a publisher
    // router.get("/:id", ads.findOne);
    // router.put("/:id", checkJwt, ads.update);
    // router.delete("/:id", checkJwt, ads.delete);
    // router.delete("/", checkJwt, ads.deleteAll);
    // router.patch('/:id/likeAd', checkJwt, ads.likeAd);
    // router.patch('/:id/unlikeAd', checkJwt, ads.likeAd);
    // router.patch('/:id/viewAd', checkJwt, ads.viewAd);
    router.post("/", ads.create);
    router.get("/", ads.findAll);// all ADs untaken based on title and/or array of keywords.
    router.get("/customer/:guid", ads.findAllCustomer); // these are all ads taken by customer
    router.get("/publisher/:id", ads.findAllPublisher); // all ads for a publisher
    router.get("/:id", ads.findOne);
    router.put("/:id", ads.update);
    router.delete("/:id", ads.delete);
    router.delete("/", ads.deleteAll);
    router.patch('/likeAd/:id', ads.likeAd);
    router.patch('/unlikeAd/:id', ads.unlikeAd);
    router.patch('/viewAd/:id', ads.viewAd);
    app.use('/api/ads', router);
};