const lowDb = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync');

const db = lowDb(new FileSync('src/data/schedules.json'));

db.defaults({ schedules: [] }).write();

exports.getSchedulesController = async (req, res) => {
    try {
        const data = db.get("schedules").value();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.createSchedulesController = async (req, res) => {
    if (req.body.type == "daily") {
        try {
            const bodySchedules = {
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

exports.findSchedulesByDateController = async (req, res) => {
    try {
        const data = db.get("schedules")
            .find({ "date": req.params.date })
            .value();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: error });
    }
}

exports.removeSchedulesByDateController = async (req, res) => {
    try {
        const data = db.get("schedules")
            .remove({ "date": req.params.date })
            .write();
        res.status(201).send({ message: "schedules removed" });
    } catch (error) {
        res.status(500).send({ message: error });
    }
}