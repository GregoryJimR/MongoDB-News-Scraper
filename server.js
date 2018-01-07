var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 8080;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/week18Populater", {
    useMongoClient: true
});

//Storing routes until moving later

//get route for scrape?
app.get("/scrape", function(req, res) {
    axios.get("http://www.ign.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        //scrape targer  
        $("listElmnt-blogItem").each(function(i, element) {
            var result = {};

            //grab children or parents of target
            result.title = $(this).children("a").text();
            result.summary = $(this).children("p").text();
            result.link = $(this).children("a").attr("href");

            db.Article
                .create(result)
                .then(function(dbArticle) {
                    res.send("IGN Scrape Complete");
                })
                .catch(function(err) {
                    res.json(err);
                });
        });
    });
});

//get route findAll()

app.get("/articles", function(req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

//route for update article to saved: true

app.post("/articles/:id", function(req, res) {
    db.Article.findByIDAndUpdate({ _id: req.params.id }, { saved: true });
}).then(function(dbArticle) {
    return "Article Saved";
}).catch(function(err) {
    return err;
});


//route for findAll() articles where saved is true and populate with it's notes

app.get("/savedArticles", function(req, res) {
    db.Article.findAll({ "saved": true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
});

//route for add associated note
app.post("/articleNotes/:id", function(req, res) {
    db.Note
        .create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        }).then(function(dbArticle) {
            res.json(dbArticle);
        }).catch(function(err) {
            res.json(err);
        });
});

//route for delete associated note

//route for delete article
app.post("/article")




















//end stored routes


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
