var express = require("express");
const subscriptionController = require("../../controllers/admin/subscriptionController");

var router = express.Router();
router.post("/planSubscription", subscriptionController.subscription);
router.post("/Subscriptionid", subscriptionController.subscription_id);
router.get("/list",subscriptionController.subscription_list);
router.post("/update_subplan", subscriptionController.subscription_data);
router.delete("/delete_subplan", subscriptionController.delete);

module.exports = router;