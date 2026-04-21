import fs from "fs";

/** Handles return VIEWS */
export const viewHandler = (req, res, next) => {
  const { url, method, headers } = req;

  // GET /view/
  if (method === "GET" && url.startsWith("/view/")) {
    fs.readFile("./resources/form.html", "utf-8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
        return;
      }
      res.send(data);
    });
  }
  // Redirect to /view/ if no view is found
  else {
    res.writeHead(302, { Location: "/view/" });
    res.send();
  }
};
