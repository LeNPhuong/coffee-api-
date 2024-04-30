const express = require("express");
const router = express.Router();
const controller = require("./../controller/billController");

router.route("/").post(controller.createBill);
router.route("/search/:key").post(controller.searchBill);
router.route("/delete/:code").delete(controller.deleteBill);

module.exports = router;
