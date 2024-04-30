const mongoose = require("mongoose");
const slugify = require("slugify");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        unique: true,
    },
    img: { type: String, required: [true, "Please enter images"] },
    status: { type: Boolean, default: true },
    type: { type: String, required: [true, "Please enter Type"] },
    slug: { type: String },
});

schema.pre("save", function (next) {
    this.slug = slugify(this.name, {
        lower: true,
        local: "en",
    }).replace("j", "");
    next();
});

const model = mongoose.model("type", schema);

module.exports = model;
