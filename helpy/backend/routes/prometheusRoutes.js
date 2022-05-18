const router = require("express").Router();
const promo = require("../metrics/prometheus");

module.exports = app => {
    router.get("/metrics", promo.getMetrics);
    app.use('/', router);
};