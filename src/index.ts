import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Hono + HTMX + Tailwind</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body class="bg-slate-100 min-h-screen flex items-center justify-center">

  <div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
    <h1 class="text-3xl font-bold text-slate-800 mb-6">
      Hono + HTMX
    </h1>

    <button
      hx-get="/hello"
      hx-target="#result"
      hx-swap="innerHTML"
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
    >
      Load Message
    </button>

    <div
      id="result"
      class="mt-4 p-4 border rounded-lg bg-slate-50"
    >
      Click the button...
    </div>
  </div>

</body>
</html>
  `)
})

app.get('/hello', (c) => {
  return c.html(`
    <div class="text-green-600 font-medium">
      Hello from Hono 🚀
    </div>
  `)
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
