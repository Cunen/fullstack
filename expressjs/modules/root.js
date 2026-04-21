import fs from "fs";

/** Handles root endpoints */
export const rootHandler = (req, res, next) => {
  const { url, method, headers } = req;

  // Redirect root to /view/
  if (!req.path.startsWith("/view")) {
    res.writeHead(302, { Location: "/view/" });
    res.end();
  } else {
    next();
  }
};
