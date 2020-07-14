const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedules-controller");

router.get("/schedules", schedulesController.getSchedulesController);
router.post("/schedules/createSchedules", schedulesController.createSchedulesController);
router.get("/schedules/findSchedules/:date", schedulesController.findSchedulesByDateController);
router.delete("/schedules/removeSchedules/:date", schedulesController.removeSchedulesByDateController);

module.exports = router;
