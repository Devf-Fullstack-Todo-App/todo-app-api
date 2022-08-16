require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors()); // TODO: Reforzar seguridad
app.use(bodyParser.json());

const { Pool, Client } = require('pg'); 
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('missing DATABASE_URL in process.env');
}
const pool = new Pool({
  connectionString,
})
const client = new Client({ connectionString });
client.connect()
.then(async () => {
  const res = await client.query('SELECT $1::text as message', ['La base de datos se conectó exitosamente'])
  console.log(res.rows[0].message)
  await client.end()
})
.catch((err) => console.error(err))

app.get('/', (req, res) => {
  console.log('Se ejecutó la ruta base');
  res.send('El servidor esta corriendo 🚀');
});

// C - Create Todos
app.post('/todos', async (req, res) => {
  console.log('Crear tarea ✅');
  const { todo } = req.body;

  const _res = await pool.query(`INSERT INTO todos (todo) VALUES ($1) RETURNING *;`, [todo]);
  res.status(200).json(_res.rows[0]);
})

// R - Read Todos
app.get('/todos/:id', async (req, res) => {
  const { id } = req.params;

  console.log('Leer la tarea tarea ' + id);
  // Proceso de obtener una sola tarea
  const _res = await pool.query('SELECT * FROM todos WHERE id = $1;', [id]);
  res.status(201).json(_res.rows[0]);
});

app.get('/todos', async (req, res) => {
  console.log('Leer lista de tareas');

  // Proceso de obtener la lista de tareas
  const _res = await pool.query('SELECT * FROM todos;');
  res.status(201).json(_res.rows);
});

// U - Update Todos
app.patch('/todos/:id', async (req, res) => {
  const { id: todoId } = req.params;
  const { todo, completed } = req.body;
  console.log(`Actualizar la tarea ${todoId}`);

  let _res = null;

  if (todo !== null && todo !== undefined) {
    _res = await pool.query(`UPDATE todos SET todo = $1 WHERE id = $2 RETURNING *;`, [todo, todoId]);
  }

  if (completed !== null && completed !== undefined) {
    _res = await pool.query(`UPDATE todos SET completed=$1 WHERE id = $2 RETURNING *;`, [completed, todoId]);
  }

  // Proceso de actualizar una tarea
  res.status(200).json(_res.rows[0]);
});

// D - Delete Todos
app.delete('/todos/:id', async (req, res) => {
  const { id: todoId } = req.params;
  console.log(`Eliminar la tarea ${todoId}`);

  // Proceso de eliminar una tarea
  const _res = await pool.query(`DELETE FROM todos WHERE id = $1 RETURNING *;`, [todoId]);
  res.status(200).json(_res.rows[0]);
});

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});
