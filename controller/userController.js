const User = require("./../model/userModel");
const Jwt = require("jsonwebtoken");
const Balcklist = require("./../model/jwtModel");
const catchAsync = require("./../authen/catchAsync");
const getjwt = require("./../authen/getJwt");

const Sendemail = require("./../utils/sendEmail");

const checkjwt = (code) => {
  return Jwt.verify(code, process.env.JWT_SECRECT);
};

exports.createUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  const checkemail = await User.findOne({ email: data.email });

  if (checkemail) {
    throw new Error("Email này đã tồn tại");
  }

  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    passwordConfirm: data.passwordConfirm,
  });

  const token = getjwt(user._id);

  res.cookie("jwt", "Bearer " + token, {
    expires: new Date(Date.now() + Number(process.env.TIME_COOKIE)),
  });

  res.status(200).json({
    message: "Succes",
    data: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      tokentotal: user.totaltoken,
      active: user.active,
      role: user.role,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  const result = await user.checkPassword(password, user.password);

  if (!result) {
    throw new Error("Mật khẩu không đúng");
  }

  const userCorrect = await User.findOne({ email: email }).select("-password -__v");

  const token = getjwt(user._id);

  res.cookie("jwt", "Bearer " + token, {
    expires: new Date(Date.now() + Number(process.env.TIME_COOKIE)),
  });

  res.status(200).json({
    message: "Succes",
    data: {
      name: userCorrect.name,
      phone: userCorrect.phone,
      email: userCorrect.email,
      tokentotal: userCorrect.totaltoken,
      active: userCorrect.active,
      role: userCorrect.role,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookietoken = req.cookies.jwt;

  if (!cookietoken) {
    throw new Error("Không thể thực hiện chức năng này");
  }

  const parsejwt = cookietoken.split(" ")[1];
  const result = await Balcklist.create({ jwt: parsejwt });
  res.clearCookie("jwt");
  res.status(204).json({});
});

exports.autoLogin = catchAsync(async (req, res, next) => {
  const cookietoken = req.cookies.jwt;
  if (!cookietoken) {
    return res.status(200).json({
      message: "No login",
      data: null,
    });
  }
  const parsejwt = cookietoken.split(" ")[1];
  const backlist = await Balcklist.findOne({ jwt: parsejwt });
  if (backlist) {
    throw new Error("Vui lòng đăng nhập lại");
  }
  const resulttoken = checkjwt(parsejwt);

  const result = await User.findById(resulttoken.id);
  res.status(200).json({
    message: "Succes",
    data: {
      name: result.name,
      phone: result.phone,
      email: result.email,
      tokentotal: result.totaltoken,
      active: result.active,
      role: result.role,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  if (!email) {
    throw new Error("Vui lòng nhập email");
  }
  const result = await User.findOne({ email: email });
  if (!result) {
    throw new Error("Tài khoản này không tồn tại");
  }

  const token = result.getTokenreset();
  result.tokenauthemail = token.hash;
  result.tokenauthtime = Date.now() + 60 * 60 * 1000;

  await result.save();
  await Sendemail({ message: token.token, email: email });
  res.status(200).json({
    status: true,
    message: "Kiểm tra email để lấy mã xác thực",
  });
});

exports.tokenResetAuthen = catchAsync(async (req, res, next) => {
  const token = req.body.auth;
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
  }).select("+tokenauthemail +tokenauthtime");

  if (user.tokenauthtime === undefined && user.tokenauthemail === undefined) {
    user.tokenauthtime = undefined;
    user.tokenauthemail = undefined;
    user.tokenresetpw = undefined;
    user.tokenresettime = undefined;
    await user.save();
    throw new Error("Bạn không thể thực hiện hành động này");
  }

  const checkauth = user.hashToken(token) === user.tokenauthemail;

  if (!checkauth) {
    throw new Error("Mật mã xác thực không đúng");
  }

  const checktime = new Date(user.tokenauthtime).getTime() > Date.now();

  if (!checktime) {
    user.tokenauthtime = undefined;
    user.tokenauthemail = undefined;
    await user.save();
    throw new Error("Không thể đổi mật khẩu vào lúc này");
  }

  const tokenreset = user.getTokenreset();

  user.tokenauthtime = undefined;
  user.tokenauthemail = undefined;
  user.tokenresetpw = tokenreset.hash;
  user.tokenresettime = Date.now() + 60 * 60 * 1000;
  // user.tokenresettime = Date.now() + 1000;

  await user.save();
  res.status(200).json({
    status: true,
    token: tokenreset.token,
  });
});

exports.resetForgot = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const token = req.body.token;
  const password = req.body.reset.password;
  const passwordConfirm = req.body.reset.passwordConfirm;

  const user = await User.findOne({ email: email }).select(
    "+tokenresetpw +tokenresettime",
  );

  if (user.tokenresetpw === undefined && user.tokenresettime === undefined) {
    throw new Error("Không thể đổi mật khẩu vào lúc này");
  }

  const checkTime = new Date(user.tokenresettime) > Date.now();
  if (!checkTime) {
    user.tokenresetpw = undefined;
    user.tokenresettime = undefined;
    await user.save();
    throw new Error("Không thể đổi mật khẩu vào lúc này");
  }

  const checkToken = user.hashToken(token) === user.tokenresetpw;
  if (!checkToken) {
    user.tokenresetpw = undefined;
    user.tokenresettime = undefined;
    await user.save();
    throw new Error("Không thể đổi mật khẩu vào lúc này");
  }

  if (password !== passwordConfirm) {
    throw new Error("Mật khẩu không trùng khớp");
  }

  if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/.test(password)) {
    throw new Error("Mật khẩu phải có chữ thường,hoa,số và ký tự đặc biệt");
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.tokenresetpw = undefined;
  user.tokenresettime = undefined;
  user.save({ validateBeforeSave: true });

  res.status(200).json({
    message: "Thay đổi thành công",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const password = req.body.password;
  const passwordNew = req.body.passwordNew;
  const passwordNewConfirm = req.body.passwordNewConfirm;

  const checkpasswordold = await req.body.user.checkPassword(
    password,
    req.body.user.password,
  );

  if (!checkpasswordold) {
    throw new Error("Mật khẩu cũ sai");
  }

  req.body.user.password = passwordNew;
  req.body.user.passwordConfirm = passwordNewConfirm;
  await req.body.user.save({ validateBeforeSave: true });

  res.status(200).json({
    message: "Đổi mật khẩu thành công",
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  let dataupdate = {};
  const data = req.body.data;

  Object.keys(data).forEach((e) => {
    if (e === "name" || e === "phone" || e === "email") {
      dataupdate[e] = data[e];
    }
  });

  if (!/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(dataupdate.phone)) {
    throw new Error("Sai định dạng số điện thoại");
  }

  const user = req.body.user;
  const update = await User.findByIdAndUpdate(user._id, dataupdate, {
    runValidators: true,
    returnDocument: "after",
  });

  res.status(200).json({
    message: "Update Succes",
  });
});

exports.getdataUser = catchAsync(async (req, res, next) => {
  const user = await User.find().select("-bill -password -__v");
  res.status(200).json({ message: "Sucess", data: { user } });
});

exports.statusUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const action = req.body.action;
  const actionUser = await User.findByIdAndUpdate(id, {
    active: action,
  });
  res.status(200).json({ message: "Cập nhật thành công" });
});
