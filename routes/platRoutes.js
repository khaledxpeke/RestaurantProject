const router = require("express").Router();
const {
createPlat,
getPlats,
} = require("../controllers/platController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/:restaurantId", roleAuth(["admin","restaurateur"]),createPlat);
router.get("/:restaurantId",getPlats);



module.exports = router;