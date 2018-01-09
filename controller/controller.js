module.exports = function(app) {
    var db = require("../models");
    var axios = require("axios");
    var cheerio = require("cheerio");


    //get route for scrape?
    app.get("/scrape", function(req, res) {
        console.log("scraping");
        axios.get("https://www.ign.com/").then(function(response) {
            var $ = cheerio.load(response.data);
            console.log("using axios");
            //scrape target  
            $(".listElmnt-blogItem").each(function(i, element) {
                console.log("blogItem grabbed");
                var result = {};

                //children or parents of target
                result.title = $(this).children("a").text();
                result.summary = $(this).children("p").text();
                result.link = $(this).children("a").attr("href");
                // console.log("title: ", result.title, " summary: ", result.summary, " link: ", result.link);
                db.Article
                    .create(result)
                    .then(function(dbArticle) {
                        console.log("creation success");
                    })
                    .catch(function(err) {
                        console.log(err);
                    });

            });
        });
        res.send("Scrape Complete");
        console.log("scrape complete");
    });

    // get route findAll()
    app.get("/articles", function(req, res) {
        console.log("getting articles");
        // Grab every document in the Articles collection
        db.Article
            .find({})
            .then(function(dbArticle) {
                console.log("rendering to handlebars");
                // If we were able to successfully find Articles, send them back to the client
                res.render('index', { article: dbArticle });
            })
            .catch(function(err) {

                res.json(err);
            });
    });

    // // //route for update article to saved: true
    //sets saved to true for articles, allowing them to render .on("click") for VIEW SAVED ARTICLES
    app.put("/saved/:id", function(req, res) {
        console.log("/saved:id called");
        let id = req.params.id;
        db.Article.update({ _id: id }, { $set: { saved: true } });
    });

    //sets saved to false for Articles, effectively deleting them
    app.put("/deleted/:id", function(req, res) {
        console.log("/saved:id called");
        let id = req.params.id;
        db.Article.update({ _id: id }, { $set: { saved: false } });
    });


    //deletes notes
    app.put("/deletedNote/:id", function(req, res) {
        let id = req.params.id;
        db.Note.remove({ _id: id });
    });


    // // //route for findAll() articles where saved is true and populate with it's notes

    app.get("/savedArticles", function(req, res) {
        db.Article.find({ saved: true })
            .then(function(dbArticle) {
                res.render('saved', { article: dbArticle });
            }).catch(function(err) {
                res.json(err);
            });
    });

    // Route for saving/updating an Article's associated Note
    app.post("/savedArticles/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note
            .create(req.body)
            .then(function(dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    // //route for add associated note
    app.get("/savedArticles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article
            .findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function(dbArticle) {
                // If we were able to successfully find an Article with the given id, send it back to the client
                res.render('saved', { articleWithNotes: dbArticle });
                console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });


    //route for delete associated note

    //route for delete article
    // app.post("/article")




















    //end stored routes
};
