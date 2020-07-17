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
                "id": req.body.id ? req.body.id : uuidv4(),
                "type": "daily",
                "intervals": validIntervals(req.body.intervals)
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
    if (req.body.type == "specific-day") {
        try {
            const bodySchedules = {
                "id": req.body.id ? req.body.id : uuidv4(),
                "type": "specific-day",
                "day": validDay(req.body.day),
                "intervals": validIntervals(req.body.intervals)
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
    if (req.body.type == "weekly") {
        try {
            const bodySchedules = {
                "id": req.body.id ? req.body.id : uuidv4(),
                "type": "weekly",
                "days": req.body.days,
                "intervals": validIntervals(req.body.intervals)
            }
            await db.get("schedules").push(bodySchedules).write();
            res.status(201).send({ message: "new schedules added" });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    }
}

exports.getSchedulesController = async (req, res) => {
    try {
        const data = db.get("schedules").value();
        res.status(201).send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.removeSchedulesController = async (req, res) => {
    try {
        const data = db.get("schedules")
            .remove({ "id": req.params.id })
            .write();
        res.status(200).send({ message: "schedules removed" });
    } catch (error) {
        res.status(500).send({ message: error.message });
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
        res.status(400).send({ message: error.message });
    }
}

function getDate(initDate, endDate) {
    let intervalsDate = [];
    const init = validDay(moment(initDate, "DD-MM-YYYY"));
    const end = validDay(moment(endDate, "DD-MM-YYYY"));

    if (init.isBefore(end)) {
        while (init <= end) {
            intervalsDate.push(moment(init).format("DD-MM-YYYY"));
            init.add(1, "day");
        }
        return intervalsDate;
    } else {
        throw new Error("Initial date must be less than final date.");
    }
}

function validDay (day) {
    if (!moment(day, "DD-MM-YYYY").isValid()){
        throw new Error("Invalid day.");
    }
    return day;
}

function validIntervals (intervals) {
    intervals.map((interval) => {
        const start = moment(interval.start, "HH:mm");
        const end = moment(interval.end, "HH:mm");

        if(!start.isValid() || !end.isValid()) {
            throw new Error("Time is not valid");
        }
        if(end.isBefore(start)) {
            throw new Error("Time start must be less than end time");
        }
    });
    return intervals;
}