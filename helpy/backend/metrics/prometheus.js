const User = require('../models/userModel');
const Review = require('../models/reviewModel');
const Ad = require('../models/adModel');
const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });


const activeClients = new client.Gauge({ name: 'active_clients', help: 'This metric counts the active clients on our website.' });
const activeAds = new client.Gauge({ name: 'active_ads', help: 'This metric counts the active ads on our website.' });
const activeReviews = new client.Gauge({ name: 'active_reviews', help: 'This metric counts the active ads on our website.' });

exports.activeClients = activeClients;
exports.activeAds = activeAds;
exports.activeReviews = activeReviews;

exports.getMetrics = async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics()
    res.write(metrics);
    res.end();
};

exports.initMetrics = async () => {
    User.count({}, function(err, count) {
        activeClients.set(count);
      });

    Ad.count({}, function(err, count) {
        activeAds.set(count);
      });
    
    Review.count({}, function(err, count) {
        activeReviews.set(count);
      });
}