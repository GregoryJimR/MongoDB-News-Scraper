$(function() {
    const location = window.location;
    //scrapes, creates articles, displays all on page via handlebars
    $("#scrape").on("click", function() {
        console.log("scrape clicked");
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).done(function() {
            console.log("scraped");
            console.log("calling /articles");
            $.ajax({
                method: "GET",
                url: "/articles"
            }).done(function(res) {
                location.assign('/articles');

            });
        });
    });

    //loads new handlebars body, should only display articles with status of save=true

    $(".saveArt").on("click", function() {
        let id = $(this).data("id");
        console.log("button id: " + id);
        $.ajax("/saved/" + id, {
            type: "PUT",
            data: true
        }).then(console.log("article saved"));
    });

    $("#viewSaved").on("click", function() {
        console.log("viewSaved clicked");
        $.ajax({
            method: "GET",
            url: "/savedArticles"
        }).done(function(res) {
            location.assign('/savedArticles');
        });
    });

    $("#saveNote").on("click", function() {
        let id = $(this).data("id");
        console.log("submit button id: " + id);
        $.ajax({
            method: "POST",
            url: "/articles/" + id
        }).done(function() {
            $.ajax({
                method: "GET",
                url: "articles/" + id
            }).done(function() {
                console.log("completed second part of call");
            });
        });
    });

});
