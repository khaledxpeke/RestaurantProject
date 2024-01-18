const router = require("express").Router();
const {
createPlat,
} = require("../controllers/platController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/:restaurantId", roleAuth(["admin","restaurateur"]),createPlat);



module.exports = router;