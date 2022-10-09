const fs = require("fs");
const http = require("http");
const minimist = require("minimist");

const readFile = (fileName) => {
  try {
    return fs.readFileSync(fileName);
  } catch (e) {
    throw e;
  }
};

const server = () => http.createServer(function (request, response) {
  let url = request.url;
  response.writeHeader(200, { "Content-Type": "text/html" });
  switch (url) {
    case "/project":
      response.write(readFile("project.html"));
      response.end();
      break;
    case "/registration":
      response.write(readFile("registration.html"));
      response.end();
      break;
    default:
      response.write(readFile("home.html"));
      response.end();
      break;
  }
});

let args = minimist(process.argv.slice(2), {
  default: {
    port: 5000,
  },
 });

server().listen(args.port, () => {
  console.log(`Server started at ${args.port}`);
});
