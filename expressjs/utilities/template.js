import fs from "fs/promises";
import path from "path";

import { viewsDir } from "./path.js";

/** Manual templating before PUG was installed */
export const openHTMLTemplate = async (file, res) => {
  // Could use sendFile for singular files
  // res.sendFile(path.join(viewsDir, `${file}.html`));

  try {
    const [baseData, htmlData] = await Promise.all([
      fs.readFile(path.join(viewsDir, "base.html"), "utf-8"),
      fs.readFile(path.join(viewsDir, `${file}.html`), "utf-8"),
    ]);

    const html = baseData.replace("<!--CONTENT-->", htmlData);

    res.send(html);
  } catch (err) {
    res.status(500).send("Error reading file: " + err.message);
  }
};
