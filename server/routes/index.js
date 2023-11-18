const userRoute = require("./user");
const productRoute = require("./product");
const productCategoryRoute = require("./productCategory");
const blogCategoryRoute = require("./blogCategory");
const brand = require("./brand");
const blog = require("./blog");
const coupon = require("./coupon");
const order = require("./order");
const insert = require("./insert");
const comment = require("./comment");
const { notFound, errHandler } = require("../middlewares/errHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRoute);
  app.use("/api/product", productRoute);
  app.use("/api/prodcategory", productCategoryRoute);
  app.use("/api/blogcategory", blogCategoryRoute);
  app.use("/api/blog", blog);
  app.use("/api/brand", brand);
  app.use("/api/coupon", coupon);
  app.use("/api/order", order);
  app.use("/api/insert", insert);
  app.use("/api/comment", comment);

  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;
