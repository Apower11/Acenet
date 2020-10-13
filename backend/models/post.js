const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
    caption: { type: String, required: true },
    picture: { type: String, required: false },
    uploadTime: { type: String, required: true},
    author: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    profilePic: { type: String, required: true },
    authorName: { type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema)