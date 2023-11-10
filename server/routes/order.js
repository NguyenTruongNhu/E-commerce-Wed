const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyAccessToken, ctrls.createOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrls.updateSatus);
router.get("/admin", [verifyAccessToken, isAdmin], ctrls.getOrders);
router.get("/", verifyAccessToken, ctrls.getUserOrders);

module.exports = router;
