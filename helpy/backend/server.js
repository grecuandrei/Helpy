const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const { sendMail } = require("./rabbit/rabbit");

require('dotenv').config();
const initMetrics = require("./metrics/prometheus").initMetrics;


// enable CORS
app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

require("./routes/adRoutes")(app);
require("./routes/userRoutes")(app);
require("./routes/reviewRoutes")(app);
require("./routes/prometheusRoutes")(app);

mongoose
    .connect(process.env.URL)
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

initMetrics();
// sendMail("samoilescusebastian@gmail.com", "ala bala portocala")

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});