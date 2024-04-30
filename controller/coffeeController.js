const Coffe = require("../model/coffeModel");
const TypeCoffe = require("../model/typeModel");
const catchAsync = require("./../authen/catchAsync");

exports.coffe = catchAsync(async (req, res, next) => {
    const drink = await Coffe.find();
    const typedrink = await TypeCoffe.find();
    res.status(200).json({
        message: "Succes",
        data: {
            type: typedrink,
            data: drink,
        },
    });
});

exports.coffeOne = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const coffe = await Coffe.findById(id);
    res.status(200).json({
        message: "Succes",
        coffe,
    });
});
