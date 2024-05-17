const express = require("express");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../public/img-product`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const controller = require("./../controller/coffeeController");
const router = express.Router();

router.route("/").get(controller.coffe);
router.route("/product").get(controller.adminProduct);
router.route("/prd/:id").get(controller.adminProductGetId);
router.route("/update/:id").patch(controller.UpdateCoffe);
router.route("/create").post(upload.single("imgprd"), controller.CreateCoffe);
router.route("/status/:id").patch(controller.StatusProduct);

router.route("/search/:id").get(controller.coffeOne);

module.exports = router;
