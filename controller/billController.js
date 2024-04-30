const Bill = require("./../model/billModel");
const crypto = require("crypto");
const catchAsync = require("./../authen/catchAsync");
const moment = require("moment");

exports.createBill = catchAsync(async (req, res, next) => {
    const token = crypto.randomBytes(6).toString("hex");
    const data = {
        name: req.body.user.name,
        phone: req.body.user.phone,
        guid: req.body.user.guid.length === 0 ? "Không có" : req.body.user.guid,
        address: req.body.map,
        bill: req.body.product,
        code: token.toLocaleUpperCase(),
        methodpay: req.body.methodpay,
        statuspay: req.body.statuspay,
        status: "Chuẩn bị",
        date: moment().day("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
    };
    await Bill.create(data);
    res.status(200).json({
        token: token.toUpperCase(),
    });
});

exports.searchBill = catchAsync(async (req, res, next) => {
    const key = req.params.key;
    const data = await Bill.findOne({ code: key }).select("-__v");
    res.status(200).json({ messgae: "Succes", data });
});

exports.deleteBill = catchAsync(async (req, res, next) => {
    const code = req.params.code;
    const data = await Bill.findOne({ code: code });
    if (!data) {
        throw new Error("Đơn hàng không tồn tại");
    }
    if (
        data.status === "Đóng Gói" ||
        data.status === "Đang Giao" ||
        data.status === "Giao Thành công"
    ) {
        throw new Error(`Không thể huỷ đơn hàng khi đến bước (${data.status})`);
    }
    const id = data._id.toString();
    await Bill.findByIdAndDelete(id);
    res.status(200).json({
        message: "Huỷ thành công",
    });
});
