require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8000;

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
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;

  console.log('Leer la tarea tarea ' + id);

  // Proceso de obtener una sola tarea

  res.send(`Info de la tarea ${id}!`);
});

app.get('/todos', (req, res) => {
  console.log('Leer lista de tareas');

  // Proceso de obtener la lista de tareas

  res.send('Lista de tareas!');
});

// U - Update Todos
app.patch('/todos/:id', (req, res) => {
  const { id: todoId } = req.params;
  console.log(`Actualizar la tarea ${todoId}`);

  // Proceso de actualizar una tarea

  res.send(`Se actualizó la tarea ${todoId} con éxito!`);
});

// D - Delete Todos
app.delete('/todos/:id', (req, res) => {
  const { id: todoId } = req.params;
  console.log(`Eliminar una tarea ${todoId}`);

  // Proceso de eliminar una tarea

  res.send(`Se eliminó la tarea ${todoId} con éxito!`);
});

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});
