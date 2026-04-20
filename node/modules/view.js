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

  res.writeHead(200);

  res.write("<html>");
  res.write("<head><title>NODEJS</title></head>");
  res.write("<body>");
  res.write("<h1>ROOT</h1>");
  res.write('<form action="/api/message" method="POST">');
  res.write('<input type="text" name="username" id="username" />');
  res.write('<input type="password" name="password" id="password" />');
  res.write('<button type="submit">Send</button>');
  res.write('</form>');
  res.write("</body>");
  res.write("</html>");

  res.end();
}