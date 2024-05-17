const mongoose = require("mongoose");
const slugify = require("slugify");

const sizeSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
});

const toppingSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"],
    unique: true,
  },
  price: { type: Number, required: [true, "Please endter Price"] },
  img: { type: String, required: [true, "Please enter images"] },
  active: { type: Boolean, default: true },
  des: { type: String },
  size: { type: [sizeSchema], default: [{ name: "Vừa", price: 0 }] },
  topping: { type: [toppingSchema], default: [] },
  type: { type: [String], required: [true, "Please enter Type"] },
  slug: { type: String },
});

schema.pre("save", function () {
  this.slug = slugify(this.name, {
    lower: true,
    local: "en",
  }).replace("j", "");
});

const model = mongoose.model("coffe", schema);

module.exports = model;
