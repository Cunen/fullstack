import fs from "fs";

export const openHTMLTemplate = (file, res) => {
  fs.readFile(`./resources/${file}.html`, "utf-8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    res.send(data);
  });
};
