const Kind = require("./../model/typeModel");
const catchAsync = require("./../authen/catchAsync");

exports.getKindProduct = catchAsync(async (req, res, next) => {
    const kind = await Kind.find();
    res.status(200).json({
        message: "Succes",
        data: { kind },
    });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const status = req.body.status;
    const updateData = await Kind.findByIdAndUpdate(id, { status: status });
    res.status(200).json({ message: "Cập nhật thành công" });
});
