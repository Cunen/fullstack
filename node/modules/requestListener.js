import { apiListener } from './api.js';
import { viewListener } from './view.js';

/** Handles incoming HTTP requests.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The outgoing response object.
 */
export function requestListener(req, res) {
  const { url, method, headers } = req;


  if (url.startsWith('/api/')) {
    apiListener(req, res);
  }

  else if (url.startsWith('/view/')) { 
    viewListener(req, res);
  }

  else {
    // Redirect to root view
    res.writeHead(302, { Location: "/view/" });
    res.end();
  }
}
