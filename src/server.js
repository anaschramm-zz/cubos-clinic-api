const { createServer } = require("http");
const app = require("./app");

const server = createServer(app);

const PORT = process.env.PORT || 2000;

server.listen(PORT, () => {
    console.log(`furacao ${PORT}`)
});