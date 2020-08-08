const http = require("http");
const fs = require("fs");
const { v4: getUuid } = require("uuid");
const port = 3000;

const readFilePromise = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
};

const getUuidPromise = () => {
  return new Promise((resolve, reject) => {
    let uuidObject = { uuid: getUuid() };
    uuidObject ? resolve(uuidObject) : reject(`couldn't find uuid`);
  });
};

const getStatusCodePromise = (statusCode) => {
  return new Promise((resolve, reject) => {
    if (http.STATUS_CODES[statusCode]) {
      resolve(statusCode);
    } else {
      reject(statusCode);
    }
  });
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
          response.writeHead(500);
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
          response.writeHead(500);
          console.error(err);
          response.end();
        });
      return;
    }

    case "/uuid": {
      getUuidPromise()
        .then((finalResult) => {
          response.writeHead(200, { "content-type": "application/json" });
          response.write(JSON.stringify(finalResult));
          response.end();
        })
        .catch((err) => {
          response.writeHead(500);
          console.error(err)
          response.end();
        });
      return;
    }

    case `/status`: {
      getStatusCodePromise(requestCode)
        .then((data) => {
          response.writeHead(data);
          response.write(data);
          response.end();
        })
        .catch((err) => {
          console.error(err);
          response.writeHead(500);
          response.end();
        });
      return;
    }

    case `/delay`: {
      setTimeout(() => {
        response.writeHead(200);
        response.write(`page is delayed by ${requestCode} sec.`);
        response.end();
      }, +requestCode * 1000);
      return;
    }

    default: {
      response.writeHead(404);
      response.write("404!, oops page not found!");
      response.end();
    }
  }
});

server.listen(port);

console.log("server is listening at ", port);
