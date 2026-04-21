import fs from "fs";

/** Handles incoming HTTP requests.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The outgoing response object.
 */
export function apiListener(req, res) {
  const { url, method, headers } = req;

  // POST /api/message
  if (url.startsWith("/api/message")) messageEndpoint(req, res);
  else defaultJSONResponse(res);
}

// /api/message
function messageEndpoint(req, res) {
  const { url, method, headers } = req;

  // POST /api/message
  if (method == "POST") {
    const body = [];

    // Read incoming data chunks
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    // Write data to file once fully received
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();

      const values = parsedBody.split("&").map((pair) => pair.split("="));

      const data = values.map((v) => v.join(" = ")).join("\n");

      fs.writeFile("./resources/message.txt", data, (err) => {
        if (err) {
          res.writeHead(500);
          res.end("Error writing to file");
          return;
        }

        res.writeHead(302, { Location: "/view/" });
        res.end();
      });
    });
  }
}

/** Send basic JSON response */
function defaultJSONResponse(res) {
  res.setHeader("Content-Type", "application/json");

  const defaultResponse = {
    message: "JSON Response",
    timestamp: new Date().toISOString(),
  };

  res.writeHead(200);

  res.write(JSON.stringify(defaultResponse));

  res.end();
}
