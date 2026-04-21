import fs from "fs";

/** Handles return VIEWS */
export const apiHandler = (req, res, next) => {
  const { url, method, headers } = req;

  // POST /api/message
  if (method === "POST" && url.startsWith("/api/message")) {
    res.writeHead(302, { Location: "/view/" });
    res.send();
  }
  // No detected API-calls
  else {
    next();
  }
};
