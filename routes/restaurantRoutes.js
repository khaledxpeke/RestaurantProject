const router = require("express").Router();
const {
createRestaurant,
getAllRestaurants,
getRestaurants
} = require("../controllers/restaurantController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", roleAuth(["admin","restaurateur"]),createRestaurant);
router.get("/", roleAuth(["admin","restaurateur"]), getRestaurants);
router.get("/client", getAllRestaurants);



module.exports = router;