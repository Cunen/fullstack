import fs from "fs";

/** Handles VIEW endpoints */
export const viewHandler = (req, res, next) => {
  const { url, method, headers } = req;

  // GET /view/
  if (method === "GET") {
    fs.readFile("./resources/form.html", "utf-8", (err, data) => {
      if (err) {
        res.status(500).send("Error reading file");
        return;
      }
      res.send(data);
    });
    return;
  }
  else {
    next();
  }
};
