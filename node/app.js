import http from "http";
import { requestListener } from "./modules/requestListener.js";

const server = http.createServer(requestListener);

// Listen on port 8080
server.listen(8080);
