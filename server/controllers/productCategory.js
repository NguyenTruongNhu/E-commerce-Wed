const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const image = req?.file?.path;
  if (!title) throw new Error("Missing inputs");
  if (image) req.body.image = image;
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot create new product-category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find();
  return res.status(200).json({
    success: response ? true : false,
    prodCategories: response ? response : "Cannot get product-category",
  });
});
const getCategoriesByAdmin = asyncHandler(async (req, res) => {
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

  if (queries?.brand) {
    formatedQueries.brand = { $regex: queries.brand, $options: "i" };
  }

  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { title: { $regex: queries.q, $options: "i" } },
        { brand: { $regex: queries.q, $options: "i" } },
      ],
    };
  }

  const qr = { ...formatedQueries, ...queryObject };

  let queryCommand = ProductCategory.find(qr);

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
    const counts = await ProductCategory.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Can not get product",
    });
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  if (req?.files?.image) req.body.image = files?.image[0]?.path;
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated." : "Cannot updated product-category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);

  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot deleted product-category",
  });
});

// Branddd
const createBrand = asyncHandler(async (req, res) => {
  const { brand, category } = req.body;
  if (!brand) throw new Error("Missing inputs");
  const response = await ProductCategory.findByIdAndUpdate(
    category,
    {
      $push: {
        brand: brand,
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Succesfully" : "Cannot create new Brand",
  });
});
const updateBrand = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const brandProduct = await ProductCategory.findById(pcid);
  brandProduct.brand = req.body;
  const response = await ProductCategory.findByIdAndUpdate(pcid, brandProduct, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot update Brand",
  });
});
const deleteOneBrand = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  console.log({ pcid });
  const brandProduct = await ProductCategory.findById(pcid);
  console.log(brandProduct);
  brandProduct.brand = req.body;
  const response = await ProductCategory.findByIdAndUpdate(pcid, brandProduct, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot update Brand",
  });
});
const deleteAllBrand = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const brandProduct = await ProductCategory.findById(pcid);
  brandProduct.brand = [];
  const response = await ProductCategory.findByIdAndUpdate(pcid, brandProduct, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot update Brand",
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createBrand,
  updateBrand,
  getCategoriesByAdmin,
  deleteAllBrand,
  deleteOneBrand,
};
