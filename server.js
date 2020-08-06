const http = require("http");
const fs = require("fs");
const { v4: uuidFunction } = require("uuid");
let port = 5000;

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const getUuid = () => {
  return new Promise((resolve, reject) => {
    let uuidObject = { uuid: uuidFunction() };
    uuidObject ? resolve(uuidObject) : reject(`couldn't find uuid`);
  });
};

const getStatusCode = (statusCode) => {
  if (statusCode >= 200 && statusCode < 208) return true;
  else if ((statusCode >= 300 && statusCode <= 308) || statusCode == 226)
    return true;
  else if (statusCode >= 400 && statusCode <= 418) return true;
  else if (
    (statusCode >= 500 && statusCode <= 511) ||
    statusCode == 511 ||
    statusCode == 598
  )
    return true;
  else if (statusCode >= 100 && statusCode <= 102) return true;
  else throw new Error("status code not found");
};

const server = http.createServer((request, response) => {
  const query = request.url;
  let arrayOfQuery = query.split("/");

  let requestCode;
  let requestQuery = "";

  if (arrayOfQuery.length > 3) {
    requestCode = arrayOfQuery[3];
    requestQuery = "/" + arrayOfQuery[2];
  }

  if (arrayOfQuery.length <= 3) {
    requestQuery = "/" + arrayOfQuery[2];
  }

  switch (requestQuery) {
    case "/html": {
      readFilePromise("./index.html")
        .then((data) => {
          response.writeHead(200, {
            "content-type": "text/html",
          });
          response.write(data);
          response.end();
        })
        .catch((err) => {
          response.writeHead(400, {
            "content-type": "text/html",
          });
          console.error(err);
          response.end();
        });
      return;
    }

    case "/json": {
      readFilePromise("./test.json")
        .then((data) => {
          response.writeHead(200, {
            "content-type": "application/json",
          });
          response.write(data);
          response.end();
        })
        .catch((err) => {
          response.writeHead(400, {
            "content-type": "application/json",
          });
          console.error(err);
          response.end();
        });
      return;
    }

    case "/uuid": {
      getUuid()
        .then((finalResult) => {
          response.writeHead(200, { "content-type": "application/json" });
          response.write(JSON.stringify(finalResult));
          response.end();
        })
        .catch((err) => {
          response.writeHead(500, { "content-type": "application/json" });
          response.write(err);
          response.end();
        });
      return;
    }

    case `/status`: {
      try {
        if (getStatusCode(+requestCode) == true) {
          response.writeHead(requestCode, { "content-type": "text/plain" });
          response.write(requestCode);
          response.end();
        }
      } catch (err) {
        response.writeHead(404);
        response.write(err.message);
        response.end();
      }
      return;
    }

    case `/delay`: {
      setTimeout(() => {
        response.writeHead(200);
        response.write(`<h1>page is delayed by ${requestCode} sec.</h1>`);
        response.end();
      }, +requestCode * 1000);
      return;
    }

    default: {
      response.write("404!, oops page not found!");
      response.end();
    }
  }
});

server.listen(port);

console.log("server is listening at ", port);
