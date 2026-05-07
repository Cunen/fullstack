import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import RouterProvider from "./structure/Router.tsx";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function enableMocking() {
  const { worker } = await import("./msw/browser");
  return worker.start();
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <RouterProvider />
  </StrictMode>,
);

/*
enableMocking().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
*/
