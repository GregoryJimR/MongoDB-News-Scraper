var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var db = require("./models");

var PORT = 8080;

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Allows comparisons in handlebars
var Handlebars = require('handlebars');
Handlebars.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  }
  else {
    return opts.inverse(this);
  }
});

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

require("./controller/html.js")(app);
require("./controller/controller.js")(app);

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/scraperHWdb", {
  // useMongoClient: true
});

//Storing routes until moving later

// //get route for scrape?
// app.get("/scrape", function(req, res) {
//   console.log("scraping");
//   axios.get("https://www.ign.com/").then(function(response) {
//     var $ = cheerio.load(response.data);
//     console.log("using axios");
//     //scrape target  
//     $(".listElmnt-blogItem").each(function(i, element) {
//       console.log("blogItem grabbed");
//       var result = {};

//       //children or parents of target
//       result.title = $(this).children("a").text();
//       result.summary = $(this).children("p").text();
//       result.link = $(this).children("a").attr("href");
//       // console.log("title: ", result.title, " summary: ", result.summary, " link: ", result.link);
//       db.Article
//         .create(result)
//         .then(function(dbArticle) {
//           console.log("creation success");
//         })
//         .catch(function(err) {
//           console.log(err);
//         });

//     });
//   });
// });




app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
