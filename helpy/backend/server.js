const express = require("express");  
const cors = require("cors");  
const app = express();  
const path = require("path");  
const mongoose = require("mongoose");  
require('dotenv').config(); 

// enable CORS  
app.use(cors());  

// parse requests of content-type - application/json  
app.use(express.json());  

// parse requests of content-type - application/x-www-form-urlencoded  
app.use(express.urlencoded({extended: true}));

require("./routes/adRoutes")(app);  

mongoose  
    .connect(process.env.URL, {  
        useNewUrlParser: true,  
        useUnifiedTopology: true,  
        useFindAndModify: false,  
        useCreateIndex: true  
    })  
    .then(() => {  
        console.log("Connected to the database!");  
    })  
    .catch(err => {
        console.log("Cannot connect to the database!", err);  
        process.exit();  
    });

// // simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome!!🥳" });
// });

// set port, listen for requests  
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}.`);  
});