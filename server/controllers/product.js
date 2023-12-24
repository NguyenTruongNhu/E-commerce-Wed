const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const makeSku = require("uniqid");

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, brand, category, color } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req.files?.images?.map((el) => el.path);
  if (!(title && description && price && brand && category && color))
    throw new Error("Missing inputs");
  req.body.slug = slugify(title);
  if (thumb) req.body.thumb = thumb;
  if (images) req.body.images = images;
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    mes: newProduct ? "Created" : "Failed.",
  });
});
const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).populate({
    path: "ratings",
    populate: {
      path: "postedBy",
      select: "firstname lastname avatar",
    },
  });
  return res.status(200).json({
    success: product ? true : false,
    productData: product ? product : "Can not get product",
  });
});
//Filtering, sorting and pagination
const getProducts = asyncHandler(async (req, res) => {
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
  let colorQueryObject = {};
  if (queries?.title) {
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  }
  if (queries?.category) {
    formatedQueries.category = { $regex: queries.category, $options: "i" };
  }
  if (queries?.brand) {
    formatedQueries.brand = { $regex: queries.brand, $options: "i" };
  }
  if (queries?.color) {
    delete formatedQueries.color;
    const colorArr = queries.color?.split(",");
    const colorQuery = colorArr.map((el) => ({
      color: { $regex: el, $options: "i" },
    }));
    colorQueryObject = { $or: colorQuery };
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
  const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };

  let queryCommand = Product.find(qr);

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
    const counts = await Product.find(qr).countDocuments();
    return res.status(200).json({
      success: response ? true : false,
      counts,
      products: response ? response : "Can not get product",
    });
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const files = req?.files;
  if (files?.thumb) req.body.thumb = files?.thumb[0]?.path;
  if (files?.images) req.body.images = files?.images?.map((el) => el.path);

  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    mes: updatedProduct ? "Updated." : "Can not update product",
  });
});
const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  return res.status(200).json({
    success: deletedProduct ? true : false,
    mes: deletedProduct ? "Deleted." : "Can not delete product",
  });
});

// Rating
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid, updatedAt } = req.body;
  if (!star || !pid) throw new Error("Mising inputs");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    // updates star & comment
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
          "ratings.$.updatedAt": updatedAt,
        },
      },
      { new: true }
    );
  } else {
    // add star & comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
      },
      { new: true }
    );
  }
  // Sum ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;

  await updatedProduct.save();

  return res.status(200).json({
    success: true,
    updatedProduct,
  });
});

const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!req.files) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    updatedProduct: response ? response : "Cannot upload images product",
  });
});
const addVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { title, price, color, proId, quantity } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req.files?.images?.map((el) => el.path);
  if (!(title && price && color && quantity)) throw new Error("Missing inputs");
  const response = await Product.findByIdAndUpdate(
    pid,
    {
      $push: {
        variants: {
          color,
          price,
          title,
          thumb,
          images,
          sku: makeSku().toUpperCase(),
          proId: pid,
          quantity,
        },
      },
    },
    { new: true }
  );
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Added variant" : "Cannot add variant",
  });
});

const updateVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { sku, title, color, price, quantity } = req.body;
  const thumb = req?.files?.thumb[0]?.path;
  const images = req.files?.images?.map((el) => el.path);
  const variantProduct = await Product.findById(pid).select("variants");
  const alreadyVariant = variantProduct?.variants?.find(
    (el) => el.sku.toString() === sku
  );
  if (alreadyVariant) {
    const response = await Product.updateOne(
      {
        variants: { $elemMatch: alreadyVariant },
      },
      {
        $set: {
          "variants.$.quantity": quantity,
          "variants.$.color": color,
          "variants.$.price": price,
          "variants.$.thumb": thumb,
          "variants.$.images": images,
          "variants.$.title": title,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
});
const updateQuanityVariant = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { sku, quantity } = req.body;
  const variantProduct = await Product.findById(pid).select("variants");
  const alreadyVariant = variantProduct?.variants?.find(
    (el) => el.sku.toString() === sku
  );
  if (alreadyVariant) {
    const response = await Product.updateOne(
      {
        variants: { $elemMatch: alreadyVariant },
      },
      {
        $set: {
          "variants.$.quantity": quantity,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
});

const deletaVariant = asyncHandler(async (req, res) => {
  const { vid, pid, color } = req.params;
  const variantProduct = await Product.findById(pid);
  const alreadyVariant = variantProduct?.variants?.find(
    (el) => el._id.toString() === vid && el.color === color
  );
  if (alreadyVariant) {
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $pull: {
          variants: { color },
        },
      },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
});
const updateQuantityProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const { quantity } = req.body;
  if (!quantity) throw new Error("Missing inputs");
  const product = await Product.findById(pid);
  product.quantity = quantity;
  const response = await Product.findByIdAndUpdate(pid, product, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Something went wrong",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
  uploadImagesProduct,
  addVariant,
  updateVariant,
  deletaVariant,
  updateQuantityProduct,
  updateQuanityVariant,
};
