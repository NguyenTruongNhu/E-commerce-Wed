const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error("Missing inputs");
  const response = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot create new blog-category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find();
  return res.status(200).json({
    success: response ? true : false,
    blogCategories: response ? response : "Cannot get blog-category",
  });
});

const getCategoriesBlog = asyncHandler(async (req, res) => {
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

  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [{ title: { $regex: queries.q, $options: "i" } }],
    };
  }

  const qr = { ...formatedQueries, ...queryObject };

  let queryCommand = BlogCategory.find(qr);

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
    const counts = await BlogCategory.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      blogs: response ? response : "Can not get product",
    });
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot updated blog-category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const response = await BlogCategory.findByIdAndDelete(bcid);

  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot deleted blog-category",
  });
});

module.exports = {
  createCategory,
  getCategoriesBlog,
  updateCategory,
  deleteCategory,
  getCategories,
};
