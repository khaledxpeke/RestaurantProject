const router = require("express").Router();
const {
createRestaurant,
getAllRestaurants,
getRestaurants,
updateRestaurant,
deleteRestaurant,
} = require("../controllers/restaurantController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", roleAuth(["admin","restaurateur"]),createRestaurant);
router.get("/", roleAuth(["admin","restaurateur"]), getRestaurants);
router.get("/client", getAllRestaurants);
router.put("/:restaurantId", roleAuth(["restaurateur"]), updateRestaurant);
router.delete("/:restaurantId", roleAuth(["admin","restaurateur"]), deleteRestaurant);

module.exports = router;