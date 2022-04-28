const router = require("express").Router();  
const ads = require("../controllers/adController.js");
const checkJwt = require("../middleware/jwtCheck");

module.exports = app => {  
    router.post("/", checkJwt, ads.create);  
    router.get("/", ads.findAll);  
    router.get("/:id", ads.findOne);  
    router.put("/:id", checkJwt, ads.update);  
    router.delete("/:id", checkJwt, ads.delete);  
    router.delete("/", checkJwt, ads.deleteAll);  
    router.patch('/:id/likeAd', checkJwt, ads.likeAd);  
    router.patch('/:id/viewAd', checkJwt, ads.viewAd); 
    app.use('/api/ads', router);  
};