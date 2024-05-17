const express = require("express");
const router = express.Router();
const controller = require("./../controller/userController");
const authenlogin = require("./../authen/authenUser");

// tự động đăng nhập
router.route("/autologin").get(controller.autoLogin); 
// tạo tài khoản
router.route("/create").post(controller.createUser);
// tạo tài khoản
router.route("/login").post(controller.loginUser);
// tạo đăng xuất
router.route("/logout").get(controller.logout);
// tạo quên mật khẩu
router.route("/forgot").post(controller.forgotPassword);
// tạo nhập mã xác thực
router.route("/authreset").post(controller.tokenResetAuthen);
// tạo đặt lại mật khẩu
router.route("/forgotreset").post(controller.resetForgot);
// tạo đặt lại mật khẩu
router.route("/resetpassword").post(authenlogin.authUser, controller.resetPassword);
// cập nhật tài khoản
router.route("/updateacount").patch(authenlogin.authUser, controller.updateUser);
// lấy dữ liệu tài khoản
router.route("/account").get(controller.getdataUser);
// cập nhật trạng thái tài khoản
router.route("/status/:id").post(controller.statusUser);

module.exports = router;
