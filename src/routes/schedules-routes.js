const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedules-controller");

router.get("/schedules/listSchedules", schedulesController.getSchedulesController);
router.post("/schedules/createSchedules", schedulesController.createSchedulesController);
router.get("/schedules/findSchedules/:initDate/:endDate", schedulesController.findSchedulesByIntervalsController);
router.delete("/schedules/removeSchedules/:id", schedulesController.removeSchedulesController);

module.exports = router;
