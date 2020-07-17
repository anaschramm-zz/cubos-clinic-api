const request = require("supertest");
const app = require("../app");

describe("Create tests type daily", () => {
    it("Create schedules with valid intervals", async () => {
        const body = {
            "type": "daily",
            "intervals": [{"start": "06:30", "end": "08:00"}]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(201);
    });

    it("Create schedules with invalid time", async () => {
        const body = {
            "type": "daily",
            "intervals": [{"start": "06:00", "end": "08:75"}]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time is not valid");
    });

    it("Create schedules with invalid start time", async () => {
        const body = {
            "type": "daily",
            "intervals": [{"start": "09:30", "end": "08:00"}]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time start must be less than end time");
    });

});

describe("Create tests type specific-day", () => { 
    it("Create schedules with valid datas and intervals", async () => {
        const body = {
            "type": "specific-day",
            "day": "13-12-500",
            "intervals": [{ "start": "09:30", "end": "10:00" },{ "start": "13:30", "end": "14:00" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(201);
    });

    it("Create schedules with invalid datas", async () => {
        const body = {
            "type": "specific-day",
            "day": "13-15-2020",
            "intervals": [{ "start": "09:30", "end": "10:00" },{ "start": "13:30", "end": "14:00" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
    });

    it("Create schedules with invalid time", async () => {
        const body = {
            "type": "specific-day",
            "day": "13-12-2020",
            "intervals": [{ "start": "09:30", "end": "35:00" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time is not valid");
    });

    it("Create schedules with invalid start time", async () => {
        const body = {
            "type": "specific-day",
            "day": "13-12-2020",
            "intervals": [{ "start": "12:30", "end": "10:00" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time start must be less than end time");
    });

});

describe("Create tests type weekly", () => { 
    it("Create schedules with valid intervals", async () => {
        const body = {
            "type": "weekly",
            "days": ["fri","sat"],
            "intervals": [{ "start": "15:30", "end": "20:00" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(201);
    });

    it("Create schedules with invalid time", async () => {
        const body = {
            "type": "weekly",
            "days": ["fri","sat"],
            "intervals": [{ "start": "15:30", "end": "20:80" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time is not valid");
    });

    it("Create schedules with invalid start time", async () => {
        const body = {
            "type": "weekly",
            "days": ["fri","sat"],
            "intervals": [{ "start": "22:30", "end": "20:30" }]
        }

        const response = await request(app).post("/schedules/createSchedules").send(body);
        expect(response.statusCode).toBe(400);
        expect(response.text).toContain("Time start must be less than end time");
    });

});

describe("remove schedules tests", () => { 
    it("remove schedule by ID", async () => {
        const body = {
            "id": "1",
            "type": "daily",
            "intervals": [{"start": "06:30", "end": "08:00"}]
        }
        await request(app).post("/schedules/createSchedules").send(body);
        const response = await request(app).delete("/schedules/removeSchedules/1");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("schedules removed");
    })

});
