const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, caption, description, category } = req.body;
  const photo = req?.file?.path;

  if (!title || !caption || !description || !category)
    throw new Error("Missing inputs");
  req.body.slug = slugify(title);
  req.body.user = req.user._id;
  if (photo) req.body.photo = photo;
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Successfully" : "Cannot create new blog",
  });
});
const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (req?.files?.photo) req.body.photo = files?.photo[0]?.path;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    mes: response ? "Updated." : "Cannot update blog",
  });
});
const getBlogs = asyncHandler(async (req, res) => {
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
  if (queries?.caption) {
    formatedQueries.brand = { $regex: queries.brand, $options: "i" };
  }
  let queryObject = {};
  if (queries?.q) {
    delete formatedQueries.q;
    queryObject = {
      $or: [
        { title: { $regex: queries.q, $options: "i" } },
        { category: { $regex: queries.q, $options: "i" } },
        { caption: { $regex: queries.q, $options: "i" } },
        { description: { $regex: queries.q, $options: "i" } },
      ],
    };
  }

  const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };

  let queryCommand = Blog.find(qr).populate([
    {
      path: "user",
      select: "firstname lastname avatar role",
    },
    {
      path: "comments",
      match: {
        check: true,
        parent: null,
      },
      populate: [
        {
          path: "user",
          select: "firstname lastname avatar",
        },
        {
          path: "replies",
          match: {
            check: true,
          },
          populate: [
            {
              path: "user",
              select: "firstname lastname avatar",
            },
          ],
        },
      ],
    },
  ]);

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
  const limit = +req.query.limit || process.env.LIMIT_BLOGS;
  const skip = (page - 1) * limit;
  queryCommand.skip(skip).limit(limit);

  //Excute query
  queryCommand.exec(async (err, response) => {
    if (err) throw new Error(err.message);
    const counts = await Blog.find(qr).countDocuments();

    return res.status(200).json({
      success: response ? true : false,
      counts,
      mes: response ? response : "Can not get Blog",
    });
  });
});

const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  const blog = await Blog.findById(bid);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
});
const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  if (!bid) throw new Error("Missing inputs");
  const blog = await Blog.findById(bid);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { likes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
  const isDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $pull: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      bid,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      mes: response ? "Successfully" : "Something went wrong",
    });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    { $inc: { numberViews: 1 } },
    { new: true }
  ).populate([
    {
      path: "user",
      select: "firstname lastname avatar role",
    },
    {
      path: "comments",
      match: {
        check: true,
        parent: null,
      },
      populate: [
        {
          path: "user",
          select: "firstname lastname avatar",
        },
        {
          path: "replies",
          match: {
            check: true,
          },
          populate: [
            {
              path: "user",
              select: "firstname lastname avatar",
            },
          ],
        },
      ],
    },
    {
      path: "likes",
      select: "firstname lastname",
    },
    {
      path: "dislikes",
      select: "firstname lastname",
    },
  ]);
  return res.status(200).json({
    success: blog ? true : false,
    mes: blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndDelete(bid);
  return res.status(200).json({
    success: blog ? true : false,
    mes: blog ? "Deleted." : "Can not delete blog",
  });
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  if (!req.file) throw new Error("Missing inputs");
  const response = await Blog.findByIdAndUpdate(
    bid,
    {
      image: req.file.path,
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Cannot upload images blog",
  });
});

module.exports = {
  createNewBlog,
  updateBlog,
  getBlogs,
  likeBlog,
  dislikeBlog,
  getBlog,
  deleteBlog,
  uploadImagesBlog,
};
