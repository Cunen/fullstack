import fs from "fs";

/** Handles API requests */
export const apiHandler = (req, res, next) => {
  const { url, method, headers } = req;

  // POST /api/message
  if (method === "POST" && url.startsWith("/message")) {
    res.writeHead(302, { Location: "/view/" });
    res.end();
  }
  // No detected API-calls
  else {
    next();
  }
};
