var mongoose = require("mongoose");

//references schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        require: false
    },
    link: {
        type: String,
        required: false
    },
    saved: {
        type: Boolean,
        default: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
