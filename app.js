const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const db = require("./src/model/sqlconnection");
const hbs = require("express-handlebars");
const path = require("path");

//Create an object in Express
const app = express();

//Setup for Handlebars
app.set("views", path.join(__dirname, "src/views"));
app.engine(
  "handlebars",
  hbs({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "/src/views/layouts"),
  }),
);
app.set("view engine", "handlebars");

//Retiving data from req sent as JSON in body
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Routes
app.use("/", require("./src/routes/general"));
app.use("/user", require("./src/routes/user"));

//Test DB Connection
db.authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) =>
    console.log("Please Start MySQL Server / Check Credentials"),
  );

//Log each request URI ,Status and its response time
app.use(morgan("dev"));

//Add Public as Static folder
app.use(express.static("./src/views/public"));

//Start Express Server
app.listen(3002, () => {
  console.log("server running in 3002 port");
});
