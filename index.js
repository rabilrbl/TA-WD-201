const fs = require("fs");
const http = require("http");
const readline = require("readline");

const readFile = (fileName) => {
  try {
    return fs.readFileSync(fileName);
  } catch (e) {
    throw e;
  }
};

const server = (regPath) => http.createServer(function (request, response) {
  let url = request.url;
  response.writeHeader(200, { "Content-Type": "text/html" });
  switch (url) {
    case "/project":
      response.write(readFile("project.html"));
      response.end();
      break;
    case "/registration":
      response.write(readFile(regPath));
      response.end();
      break;
    default:
      response.write(readFile("home.html"));
      response.end();
      break;
  }
});

const lineDetail = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

lineDetail.question(`Please provide registration file path - `, (path) => {
  server(path).listen(3000);
});
