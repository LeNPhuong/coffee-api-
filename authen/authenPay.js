const jwt = require("jsonwebtoken");
const catchAsync = require("./catchAsync");
const blacklist = require("./../model/jwtModel");
const User = require("./../model/userModel");

exports.AuthenPay = catchAsync(async (req, res, next) => {
    const cookie = req.cookies.jwt;
    // console.log(cookie);
    if (cookie) {
        const parseCookie = cookie.split(" ")[1];
        const checkjwt = await blacklist.findOne({ jwt: parseCookie });

        if (checkjwt) {
            throw new Error("Không thể mua hàng vào lúc này");
        }
        const parseJWT = jwt.verify(parseCookie, process.env.JWT_SECRECT, function (err, decoded) {
            if (err) {
                return err.message;
            }
            return decoded;
        });
        if (parseJWT === "jwt expired") {
            throw new Error("Không thể thực hiện thao tác này");
        }
        const infor = await User.findById(parseJWT.id);
        req.body.infor = infor;
    }
    next();
});
