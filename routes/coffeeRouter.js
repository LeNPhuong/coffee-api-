const express = require("express");
const controller = require("./../controller/coffeeController");
const router = express.Router();

router.route("/").get(controller.coffe);
router.route("/search/:id").get(controller.coffeOne);

module.exports = router;
