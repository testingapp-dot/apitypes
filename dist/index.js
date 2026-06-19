import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { query } from './db.js';
const app = new Hono();
function layout(content) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>

  <script src="https://unpkg.com/htmx.org@2.0.4"></script>

  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 700px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,.1);
    }

    form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    input {
      flex: 1;
      padding: 10px;
    }

    button {
      padding: 10px 16px;
      cursor: pointer;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }

    .done {
      text-decoration: line-through;
      color: gray;
    }

    .actions {
      display: flex;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    ${content}
  </div>
</body>
</html>
`;
}
async function renderTodos() {
    const rows = await query(`
    SELECT *
    FROM todos
    ORDER BY id DESC
  `);
    return `
<ul>
${rows
        .map((todo) => `
<li id="todo-${todo.id}">
  <span class="${todo.completed ? 'done' : ''}">
    ${todo.title}
  </span>

  <div class="actions">

    <button
      hx-post="/toggle/${todo.id}"
      hx-target="#todos"
      hx-swap="innerHTML">
      ${todo.completed ? 'Undo' : 'Done'}
    </button>

    <button
      hx-delete="/todos/${todo.id}"
      hx-target="#todos"
      hx-swap="innerHTML">
      Delete
    </button>

  </div>
</li>
`)
        .join('')}
</ul>
`;
}
app.get('/', async (c) => {
    const todosHtml = await renderTodos();
    return c.html(layout(`
      <h1>Todo App</h1>

      <form
        hx-post="/todos"
        hx-target="#todos"
        hx-swap="innerHTML">

        <input
          type="text"
          name="title"
          placeholder="New todo..."
          required>

        <button>Add</button>
      </form>

      <div id="todos">
        ${todosHtml}
      </div>
    `));
});
app.post('/todos', async (c) => {
    const body = await c.req.parseBody();
    const title = String(body.title || '').trim();
    if (title) {
        await query('INSERT INTO todos (title) VALUES (?)', [title]);
    }
    return c.html(await renderTodos());
});
app.post('/toggle/:id', async (c) => {
    const id = c.req.param('id');
    await query(`
    UPDATE todos
    SET completed = NOT completed
    WHERE id = ?
  `, [id]);
    return c.html(await renderTodos());
});
app.delete('/todos/:id', async (c) => {
    const id = c.req.param('id');
    await query('DELETE FROM todos WHERE id = ?', [id]);
    return c.html(await renderTodos());
});
serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
