$("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).done(function() {
        $.ajax({
            method: "GET",
            url: "/articles"
        }).done(function() {

        })
    })
})
