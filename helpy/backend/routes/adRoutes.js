const router = require("express").Router();
const ads = require("../controllers/adController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {
    router.post("/:guid", checkJwt, ads.create);
    router.get("/:id", ads.findOne);
    router.get("/", ads.findAll);// all ADs untaken based on title and/or array of keywords.
    router.get("/customer/:guid", ads.findAllCustomer); // these are all ads taken by customer
    router.get("/publisher/:guid", ads.findAllPublisher); // all ads for a publisher
    router.get("/publisherTaken/:guid", ads.findAllPublisherTaken); // all ads taken for a publisher
    router.put("/:id", checkJwt, ads.update);
    router.delete("/:id", checkJwt, ads.delete);
    router.patch('/likeAd/:id', checkJwt, ads.likeAd);
    router.patch('/unlikeAd/:id', checkJwt, ads.unlikeAd);
    router.patch('/viewAd/:id', checkJwt, ads.viewAd);
    router.patch('/renew/:id', checkJwt, ads.renewAd);
    router.get('/topViewedKeyword/:keyword/:guid', ads.topViewedKeyword);
    router.get('/topXViewed/:x/:guid', ads.topXViewed);
    router.get('/topXLiked/:x/:guid', ads.topXLiked);
    app.use('/api/ads', router);
};