const Coffe = require("../model/coffeModel");
const TypeCoffe = require("../model/typeModel");
const catchAsync = require("./../authen/catchAsync");

exports.adminProduct = catchAsync(async (req, res, next) => {
  const page = req.query.page;
  const skip = (page - 1) * 5;
  const length = await Coffe.find();
  const drink = await Coffe.find().skip(skip).limit(5);
  res.status(200).json({
    message: "Succes",
    result: length.length,
    data: { drink },
  });
});

exports.adminProductGetId = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await Coffe.findById(id);
  res.status(200).json({
    message: "Succes",
    product,
  });
});

exports.coffe = catchAsync(async (req, res, next) => {
  const drink = await Coffe.find();
  const typedrink = await TypeCoffe.find();
  res.status(200).json({
    message: "Succes",
    data: {
      type: typedrink,
      data: drink,
    },
  });
});

exports.coffeOne = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const coffe = await Coffe.findById(id);
  res.status(200).json({
    message: "Succes",
    coffe,
  });
});

exports.UpdateCoffe = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  // const data = req.body.update;
  const data = req.body.data;

  if (!data) {
    throw new Error("Không có gì để cập nhật");
  }
  const datasz = {};
  Object.keys(data).forEach((e) => {
    if (data[e].length === 0) {
      return;
    }

    if (e === "name" || e === "price" || e === "des") {
      datasz[e] = data[e];
    }
  });

  const product = await Coffe.findByIdAndUpdate(id, datasz, {
    runValidators: true,
  });

  res.status(200).json({
    message: "Cập nhật thành công",
  });
});

exports.CreateCoffe = catchAsync(async (req, res, next) => {
  const data = req.body;
  console.log(data);
  const img = req.file.filename;
  if (!img) {
    throw new Error("Vui lòng thêm ảnh");
  }

  if (!data) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  if (data.nameprd.length === 0 || data.priceprd.length === 0) {
    throw new Error("Không thể để trống trường tên,giá");
  }

  // console.log(data.nameprd.length);
  let topping = [];
  let size = [];
  let kind = [];
  const handleTopping = new Set();
  const handleSize = new Set();
  const handelKind = new Set();

  Object.keys(data).forEach((e) => {
    if (e.includes("topping")) {
      if (data[e].length === 0) {
        return;
      } else {
        handleTopping.add(data[e]);
        return;
      }
    }
    if (e.includes("size")) {
      if (data[e].length === 0) {
        return;
      } else {
        handleSize.add(data[e]);
        return;
      }
    }
    if (e.includes("type")) {
      if (data[e].length === 0) {
        return;
      } else {
        handelKind.add(data[e]);
        return;
      }
    }
  });

  // handle size

  handleSize.forEach((e) => {
    size.push(JSON.parse(e));
  });

  const sizeSmall = size.find((e) => e.name === "Nhỏ");
  const sizeNormal = size.find((e) => e.name === "Vừa");
  const sizeBig = size.find((e) => e.name === "Lớn");

  size = [];
  sizeSmall && size.push(sizeSmall);
  sizeNormal && size.push(sizeNormal);
  sizeBig && size.push(sizeBig);

  // handle topping

  handleTopping.forEach((e) => {
    topping.push({ name: e, price: 10000 });
  });

  // handle kind

  handelKind.forEach((e) => {
    kind.push(e);
  });

  if (kind.length === 0) {
    throw new Error("Vui lòng nhập loại sản phẩm");
  }

  await Coffe.create({
    name: data.nameprd,
    price: data.priceprd,
    des: data.desprd,
    img: `http://localhost:3001/public/img-product/${img}`,
    topping: topping,
    size: size,
    type: kind,
  });

  // res.send(
  //   `<script>
  //         window.location.href = "http://localhost:5173/dashboard/product/add";
  //         alert("Thêm thành công")
  //    </script>`,
  // );
  res.send(
    `<script>
      window.location.href = "http://localhost:4200/admin/add";
      alert("Thêm thành công")
     </script>`,
  );
});

exports.StatusProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const action = req.query.action;

  if (action === "ACTIVE") {
    await Coffe.findByIdAndUpdate(id, { active: true });
    return res.status(200).json({ message: "Cập nhật thành công" });
  } else if (action === "DELETE") {
    await Coffe.findByIdAndUpdate(id, { active: false });
    return res.status(200).json({ message: "Cập nhật thành công" });
  }
});

exports.GetDetailsBill = catchAsync(async (req, res, next) => {});
