import { Hono } from "hono";
import { db } from "./db.js";

export const routes = new Hono();

/* 🔹 Home page */
routes.get("/", async (c) => {
  const [todos] = await db.query("SELECT * FROM todos ORDER BY id DESC");

  return c.html(`
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
  <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="container">
    <h1>Todo App</h1>

    <form 
      hx-post="/add"
      hx-target="#todo-list"
      hx-swap="innerHTML"
    >
      <input name="title" placeholder="New todo..." required />
      <button>Add</button>
    </form>

    <ul id="todo-list">
      ${renderTodos(todos)}
    </ul>
  </div>
</body>
</html>
  `);
});

/* 🔹 Add todo */
routes.post("/add", async (c) => {
  const body = await c.req.parseBody();
  const title = body.title as string;

  await db.query("INSERT INTO todos (title) VALUES (?)", [title]);

  const [todos] = await db.query("SELECT * FROM todos ORDER BY id DESC");
  return c.html(renderTodos(todos));
});

/* 🔹 Toggle complete */
routes.post("/toggle/:id", async (c) => {
  const id = c.req.param("id");

  await db.query(
    "UPDATE todos SET completed = NOT completed WHERE id = ?",
    [id]
  );

  const [todos] = await db.query("SELECT * FROM todos ORDER BY id DESC");
  return c.html(renderTodos(todos));
});

/* 🔹 Delete */
routes.post("/delete/:id", async (c) => {
  const id = c.req.param("id");

  await db.query("DELETE FROM todos WHERE id = ?", [id]);

  const [todos] = await db.query("SELECT * FROM todos ORDER BY id DESC");
  return c.html(renderTodos(todos));
});

/* 🔹 HTML renderer */
function renderTodos(todos: any[]) {
  return todos
    .map(
      (t) => `
    <li class="${t.completed ? "done" : ""}">
      <span
        hx-post="/toggle/${t.id}"
        hx-target="#todo-list"
        hx-swap="innerHTML"
        style="cursor:pointer"
      >
        ${t.title}
      </span>

      <button
        hx-post="/delete/${t.id}"
        hx-target="#todo-list"
        hx-swap="innerHTML"
      >
        ❌
      </button>
    </li>
  `
    )
    .join("");
}