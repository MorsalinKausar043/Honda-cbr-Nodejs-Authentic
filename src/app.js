require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
require("./db/db");
const router = require("./router");
const port = process.env.PORT || 8001;


// middlewara link 

const staticPath = path.join(__dirname, "../public");
const DynamcPath = path.join(__dirname, "../templates/views");

// middleware 
app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use("jq", express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use(router);
app.use(express.static(staticPath));
app.set("view engine", "ejs");
app.set("views", DynamcPath);


// app llistining

app.listen(port, () => console.log(`express port is ${port}!`));
