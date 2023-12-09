const router = require("express").Router();
const ctrls = require("../controllers/productCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
router.post(
  "/",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.createCategory
);
router.post("/brand", [verifyAccessToken, isAdmin], ctrls.createBrand);
router.put(
  "/updateBrand/:pcid",
  [verifyAccessToken, isAdmin],
  ctrls.updateBrand
);
router.get("/", ctrls.getCategories);
router.get("/admin", [verifyAccessToken, isAdmin], ctrls.getCategoriesByAdmin);
router.put(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  ctrls.updateCategory
);
router.delete(
  "/deleteOneBrand/:pcid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteOneBrand
);
router.delete(
  "/deleteAllBrand/:pcid",
  [verifyAccessToken, isAdmin],
  ctrls.deleteAllBrand
);

router.delete("/:pcid", [verifyAccessToken, isAdmin], ctrls.deleteCategory);

module.exports = router;
