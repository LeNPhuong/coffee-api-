const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vui lòng nhập tên"],
  },
  email: {
    type: String,
    required: [true, "Vui lòng nhập Email"],
    validate: [validator.isEmail, "Sai định dạng email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Vui lòng nhập số điện thoại"],
    minLength: [10, "Số điện thoại không thể nhỏ hơn 10 ký tự"],
    maxLength: [10, "Số điện thoại không thể lớn hơn 10 ký tự"],
    validate: {
      validator: function (el) {
        return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(el);
      },
      message: "Số Điện thoại không đúng định dạng",
    },
  },
  password: {
    type: String,
    required: [true, "Vui lòng nhập mật khẩu"],
    minLength: [8, "Mật khẩu không không thể nhỏ hơn 8 ký tự"],
    validate: {
      validator: function (el) {
        return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/.test(el);
      },
      message: "Mật khẩu phải có chữ thường,hoa,số và ký tự đặc biệt",
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Mật khẩu không giống nhau",
    },
    select: false,
  },
  datecreated: { type: Date, default: Date.now(), select: false },
  active: { type: Boolean, default: true },
  role: { type: String, default: "user" },
  tokenauthemail: { type: String, select: false },
  tokenauthtime: { type: Date, select: false },
  tokenresetpw: { type: String, select: false },
  tokenresettime: { type: Date, select: false },
  bill: { type: [] },
  totaltoken: { type: Number },
});
// mã hoá
schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
// kiểm tra mật khẩu
schema.methods.checkPassword = function (pwEnter, pwUser) {
  return bcrypt.compare(pwEnter, pwUser);
};
//
schema.methods.hashToken = function (token) {
  return crypto.createHmac("sha256", process.env.JWT_SECRECT).update(token).digest("hex");
};
// lấy mã đặt lại mật khẩu
schema.methods.getTokenreset = function () {
  const token = crypto.randomBytes(6).toString("hex");
  const hash = crypto.createHmac("sha256", process.env.JWT_SECRECT).update(token).digest("hex");

  return { token, hash };
};
//
const model = mongoose.model("user", schema);

module.exports = model;
