const express = require("express");
const router = express.Router();
const controller = require("./../controller/billController");
const AuthenBill = require("./../authen/authenPay");

router.route("/").post(AuthenBill.AuthenPay, controller.createBill);
router.route("/search/:key").post(controller.searchBill);
router.route("/delete/:code").delete(AuthenBill.AuthenPay, controller.deleteBill);
router.route("/update").patch(controller.UpdateBill);
router.route("/all").get(controller.getAllBill);

module.exports = router;
