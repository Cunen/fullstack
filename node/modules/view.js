import fs from "fs";

/** Handles incoming HTTP requests.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The outgoing response object.
 */
export function viewListener(req, res) {
  const { url, method, headers } = req;

  defaultHTMLResponse(res);
}

/** Send basic HTML response */
function defaultHTMLResponse(res) {
  res.setHeader("Content-Type", "text/html");

  const html = fs.readFileSync("./resources/form.html", "utf-8");

  res.writeHead(200);

  res.end(html);
}
