const lowDb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync');
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");

const db = lowDb(new FileSync('src/data/schedules.json'));

db.defaults({ schedules: [] }).write();

exports.createSchedulesController = async (req, res) => {
    if (req.body.type == "daily") {
        try {
            const bodySchedules = {
                "id": uuidv4(),
                "type": "daily",
                "intervals": req.body.intervals
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(500).send({ message: error });
        }
    }
    if (req.body.type == "specific-day") {
        try {
            const bodySchedules = {
                "id": uuidv4(),
                "type": "specific-day",
                "day": req.body.day,
                "intervals": req.body.intervals
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(500).send({ message: error });
        }
    }
    if (req.body.type == "weekly") {
        try {
            const bodySchedules = {
                "id": uuidv4(),
                "type": "weekly",
                "days": req.body.days,
                "intervals": req.body.intervals
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(500).send({ message: error });
        }
    }
}

exports.getSchedulesController = async (req, res) => {
    try {
        const data = db.get("schedules").value();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.removeSchedulesController = async (req, res) => {
    try {
        const data = db.get("schedules")
            .remove({ "id": req.params.id })
            .write();
        res.status(201).send({ message: "schedules removed" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.findSchedulesByIntervalsController = async (req, res) => {
    try {
        const allSchedules = db.get("schedules").value();
        const intervalsDate = getDate(req.params.initDate, req.params.endDate);
        let responseIntervals = [];

        for (const dateType of allSchedules) {
            if (dateType.type == "daily") {
                for (const dateDaily of intervalsDate) {
                    const responseDaily = { "day": dateDaily, "intervals": dateType.intervals };
                    responseIntervals.push(responseDaily);
                }
            }
            if (dateType.type == "specific-day") {
                for (const dateSpecific of intervalsDate) {
                    if (dateType.day == dateSpecific) {
                        const responseSpecific = { "day": dateSpecific, "intervals": dateType.intervals };
                        responseIntervals.push(responseSpecific);
                    }
                }
            }
            if (dateType.type == "weekly") {
                for (const dateWeekly of intervalsDate) {
                    const dayWeekly = moment(dateWeekly, "DD-MM-YYYY").format("ddd").toLowerCase();
                    if (dateType.days.includes(dayWeekly)) {
                        const responseWeekly = { "day": dateWeekly, "intervals": dateType.intervals };
                        responseIntervals.push(responseWeekly);
                    }
                }

            }
        }
        res.status(200).send(responseIntervals);
    } catch (error) {
        res.status(500).send({ message: "Initial date must be less than final date." });
    }
}

function getDate(initDate, endDate) {
    let intervalsDate = [];
    const init = moment(initDate, "DD-MM-YYYY");
    const end = moment(endDate, "DD-MM-YYYY");

    if (init.isBefore(end)) {
        while (init <= end) {
            intervalsDate.push(moment(init).format("DD-MM-YYYY"));
            init.add(1, "day");
        }
        return intervalsDate;
    } else {
        throw new Error();
    }
}
