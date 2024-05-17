const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  guid: { type: String },
  bill: { type: [], required: true },
  address: { type: String, required: true },
  code: { type: String, required: true },
  methodpay: { type: {} },
  statuspay: { type: String },

  status: {
    type: String,
    enum: ["Chuẩn bị", "Đóng gói", "Đang giao", "Giao thành công"],
  },
  date: {
    type: String,
    required: true,
    default: new Date().getTime(),
  },
  connect: { type: String },
  tokentotal: { type: Number },
});

const model = mongoose.model("bill", schema);

module.exports = model;
