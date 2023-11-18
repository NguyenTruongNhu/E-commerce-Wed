const router = require("express").Router();
const ctrls = require("../controllers/comment");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken], ctrls.createNewComment);
router
  .route("/:commentId")
  .put([verifyAccessToken], ctrls.updateComment)
  .delete([verifyAccessToken], ctrls.deleteComment);

module.exports = router;
