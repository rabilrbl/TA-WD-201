const app = require("./app");
const reload = require("reload");
const http = require("http");

const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
reload(app);
