import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hono + HTMX</title>

  <script src="https://unpkg.com/htmx.org@2.0.4"></script>

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      background: #f4f4f5;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #222;
    }

    .card {
      background: white;
      padding: 2rem;
      width: 400px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,.1);
    }

    h1 {
      margin-bottom: 1rem;
    }

    button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background: #1d4ed8;
    }

    #result {
      margin-top: 1rem;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      min-height: 60px;
      background: #fafafa;
    }

    .success {
      color: #16a34a;
      font-weight: bold;
    }
  </style>
</head>
<body>

  <div class="card">
    <h1>HonoJS + htmx</h1>

    <button
      hx-get="/hello"
      hx-target="#result"
      hx-swap="innerHTML">
      Load Message
    </button>

    <div id="result">
      Click the button...
    </div>
  </div>

</body>
</html>
  `)
})

app.get('/hello', (c) => {
  return c.html(`
    <p class="success">
      Hello from Hono 🚀
    </p>
  `)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
