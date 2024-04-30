const User = require("./../model/userModel");
const Jwt = require("jsonwebtoken");
const catchAsync = require("./../authen/catchAsync");
const { checkBlackList } = require("./checkBlackList");

exports.authUser = catchAsync(async (req, res, next) => {
    const token = req.cookies.jwt;
    const parsetoken = token.split(" ")[1];

    const blacklist = await checkBlackList(parsetoken);
    if (blacklist) {
        throw new Error("Không thể thực hiện thao tác này");
    }

    const result = await Jwt.verify(
        parsetoken,
        process.env.JWT_SECRECT,
        function (err, decoded) {
            if (err) {
                return err.message;
            }
            return decoded;
        },
    );

    if (result === "jwt expired") {
        throw new Error("Không thể thực hiện thao tác này");
    }

    const user = await User.findById(result.id).select("+password");

    if (!user) {
        throw new Error("Không thể thực hiện thao tác này");
    }

    req.body.user = user;
    next();
});
