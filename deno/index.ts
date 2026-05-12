import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";

const tasks = [{ title: "Task 1", completed: false }];

const router = new Router();

router.get("/", (ctx) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
      <head><title>Hello oak!</title><head>
      <body>
        <h1>Hello oak!</h1>
      </body>
    </html>
  `;
});

router.get("/task", (ctx) => {
  ctx.response.body = tasks;
});

router.post("/task", async (ctx) => {
  const json = await ctx.request.body.json();
  tasks.push(json);
  ctx.response.body = { message: "Task added successfully" };
});

const app = new Application();

app.use(router.routes());

app.use(router.allowedMethods());

app.listen({ port: 8080 });
