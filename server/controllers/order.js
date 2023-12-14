const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { products, total, address, status } = req.body;
  products.map((el) => el).products;
  if (address) {
    await User.findByIdAndUpdate(_id, { address, cart: [] });
  }
  const data = { products, total, orderBy: _id };
  if (status) data.status = status;
  const rs = await Order.create(data);
  return res.status(200).json({
    success: rs ? true : false,
    rs: rs ? rs : "Something went wrong",
  });
});

const updateSatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) throw new Error("Missing status ");
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    rs: response ? response : "Something went wrong",
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  const { _id } = req.user;
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  //Format lại các operators
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  if (queries?.title) {
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  }

  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { color: { $regex: queries.q, $options: "i" } },
        { title: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
        { brand: { $regex: queries.q, $options: "i" } },
        { description: { $regex: queries.q, $options: "i" } },
      ],
    };
  }

  const qr = { ...formatedQueries, orderBy: _id, ...queryObject };

  let queryCommand = Order.find(qr);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //fields limiting - lọc ra những cái cần nếu có dấu trừ đằng trước thì loại trừ nó
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // Pagination -- phân trang
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Excute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Can not get product",
    });
  });
});
const getOrders = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  //Format lại các operators
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchedEl) => `$${matchedEl}`
  );
  const formatedQueries = JSON.parse(queryString);
  if (queries?.title) {
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  }

  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { color: { $regex: queries.q, $options: "i" } },
        { title: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
        { brand: { $regex: queries.q, $options: "i" } },
        { description: { $regex: queries.q, $options: "i" } },
      ],
    };
  }

  const qr = { ...formatedQueries, ...queryObject };

  let queryCommand = Order.find(qr).populate(
    "orderBy",
    "firstname lastname mobile address"
  );

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy);
  }
  //fields limiting - lọc ra những cái cần nếu có dấu trừ đằng trước thì loại trừ nó
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  // Pagination -- phân trang
  const page = +req.query.page || 1;
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Excute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Order.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      orders: response ? response : "Can not get product",
    });
  });
});

module.exports = {
  createOrder,
  updateSatus,
  getUserOrders,
  getOrders,
};
