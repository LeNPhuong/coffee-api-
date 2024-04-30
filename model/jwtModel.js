const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    jwt: { type: String },
});

const model = mongoose.model("blacklist", schema);

module.exports = model;
