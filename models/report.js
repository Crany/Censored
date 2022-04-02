const mongoose = require('mongoose') // Optional

const reportSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    reason: String,
    reportedID: String,
    informantID: String,
});

module.exports = mongoose.model("Report", reportSchema);