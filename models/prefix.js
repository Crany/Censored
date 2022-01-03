const mongoose = require('mongoose') // Optional

const prefixSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prefix: String,
    userID: String,
    userTag: String,
})

module.exports = mongoose.model("Prefix", prefixSchema)