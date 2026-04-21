import fs from "fs";

export const openHTMLTemplate = (file, res) => {
  fs.readFile(`./resources/${file}.html`, "utf-8", (err, htmlData) => {
    if (err) {
      res.status(500).send("Error reading file");
      return;
    }
    fs.readFile("./resources/index.css", "utf-8", (err, cssData) => {
      if (err) {
        res.status(500).send("Error reading CSS file");
        return;
      }
      htmlData = htmlData.replace(
        "<style></style>",
        `<style>${cssData}</style>`
      );
      res.send(htmlData);
    });
  });
};
