const express = require("express");
const router = express.Router();
const controller = require("./../controller/typeController");

router.route("/").get(controller.getKindProduct);
router.route("/update/:id").patch(controller.updateStatus);

module.exports = router; 
