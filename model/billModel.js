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
        enum: ["Chuẩn bị", "Đóng Gói", "Đang Giao", "Giao Thành công"],
    },
    date: {
        type: String,
        required: true,
        default: new Date().getTime(),
    },
});

const model = mongoose.model("bill", schema);

module.exports = model;
