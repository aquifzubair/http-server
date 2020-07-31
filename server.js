const http = require("http");
const fs = require("fs");
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
    let result, i, j;
    result = "";
    for (i = 0; i < 32; i++) {
      if (i == 8 || i == 12 || i == 16 || j == 20) result = result + "-";
      j = Math.floor(Math.random() * 16)
        .toString(16)
        .toUpperCase();
      result = result + j;
    }
    let finalResult = { uuid: result };
    result ? resolve(finalResult) : reject(result);
  });
};

const getStatusCode = (statusCode) => {
  if (statusCode == 200) return true;
  else if (statusCode == 300) return true;
  else if (statusCode == 400) return true;
  else if (statusCode == 500) return true;
  else if (statusCode == 100) return true;
  else throw new Error("status code not found");
};

const server = http.createServer((request, response) => {
  const query = request.url.slice(12);
  const query1 = parseInt(request.url.slice(11));

  switch (request.url) {
    case "/GET/html": {
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

    case "/GET/json": {
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

    case "/GET/uuid": {
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

    case `/GET/status/${query}`: {
      try {
        if (getStatusCode(query) == true) {
          response.writeHead(query, { "content-type": "text/plain" });
          response.write(query);
          response.end();
        }
      } catch (err) {
        response.write(err.message);
        response.end();
      }
      return;
    }

    case `/GET/delay/${query1}`: {
      setTimeout(() => {
        response.writeHead(200, { "content-type": "plain/text" });
        response.write(`I late page delay by ${query1} seconds.`);
        response.end();
      }, query1 * 1000);
      return;
    }

    default: {
      response.write('404!, oops page not found!')
      response.end();
    }
  }
});

server.listen(port);

console.log("server is listening at ", port);
