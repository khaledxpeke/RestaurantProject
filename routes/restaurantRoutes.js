const router = require("express").Router();
const {
createRestaurant,
getRestaurants,
updateRestaurant,
deleteRestaurant,
} = require("../controllers/restaurantController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", roleAuth(["admin","restaurateur"]),createRestaurant);
router.get("/", roleAuth(["admin","restaurateur","client"]), getRestaurants);
router.put("/:restaurantId", roleAuth(["restaurateur"]), updateRestaurant);
router.delete("/:restaurantId", roleAuth(["admin","restaurateur"]), deleteRestaurant);

module.exports = router;