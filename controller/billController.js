const Bill = require("./../model/billModel");
const User = require("./../model/userModel");
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

    let totaltoken = data.bill.reduce((acc, cur) => acc + cur.quantity * 10, 0);

    if (req.body.infor) {
        data.connect = req.body.infor._id;
        data.tokentotal = totaltoken;
    }
    // console.log(data);
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

exports.UpdateBill = catchAsync(async (req, res, next) => {
    const idsearch = req.query.id;
    const tokensearch = req.query.code;
    const data = req.body.status;

    const statusArr = ["Chuẩn bị", "Đóng gói", "Đang giao", "Giao thành công"];
    const resultStatus = statusArr.find((e) => e === data);
    if (!resultStatus) {
        throw new Error("Không có gì để cập nhật");
    }
    console.log(resultStatus);

    let BillData;
    try {
        BillData = await Bill.findOne({ code: tokensearch });
    } catch (error) {
        BillData = null;
    }

    if (!BillData) {
        throw new Error("Không tìm thấy đơn hàng để thể sửa đổi");
    }

    BillData.status = data;

    if (idsearch) {
        let user;

        try {
            user = await User.findById(idsearch);
        } catch (error) {
            user = null;
        }

        if (!user) {
            throw new Error("Không thể thực hiện thao tác này");
        }

        if (user._id.toString() !== BillData.connect)
            throw new Error("Không thể cập nhật vào lúc này");

        if (BillData.status === "Giao thành công") {
            if (user.bill.length === 0 || !user.bill) {
                user.bill = [BillData];
            } else {
                user.bill.push(BillData);
            }
            if (!user.totaltoken) {
                user.totaltoken = BillData.tokentotal;
            } else {
                user.totaltoken += BillData.tokentotal;
            }
        }
        await user.save();
    }
    await BillData.save();

    res.status(204).json({ message: "Cập nhật thành công" });
});
