require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8000;

app.use(cors()); // TODO: Reforzar seguridad
app.use(bodyParser.json());

const hashPassword = require('./src/utils/hashPassword');
const verifyPassword = require('./src/utils/verifyPassword');

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

// Users
app.post('/users', async (req, res) => {
  console.log('Crear Usuario');
  const { email, name, phone, password } = req.body;

  // Hash Password
  const hashedPassword = hashPassword(password);

  const _res = await pool.query(
    `INSERT INTO users (email, name, phone, password) VALUES ($1, $2, $3, $4) RETURNING *;`, 
    [email, name, phone, hashedPassword]
  );

  const user = _res.rows[0];
  delete user.password;

  res.status(200).json(user);
})

app.get('/users', async (req, res) => {
  console.log('Leer lista de usuarios');

  const _res = await pool.query('SELECT * FROM users;');
  res.status(201).json(_res.rows);
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  console.log('Usuario ' + id);

  const _res = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);
  res.status(201).json(_res.rows[0]);
});

app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, phone, password } = req.body;
  console.log(`Actualizar Usuario ${id}`);

  let _res = null;

  if (email !== null && email !== undefined) {
    _res = await pool.query(`UPDATE users SET email = $1 WHERE id = $2 RETURNING *;`, [email, id]);
  }

  if (name !== null && name !== undefined) {
    _res = await pool.query(`UPDATE users SET name = $1 WHERE id = $2 RETURNING *;`, [name, id]);
  }
  
  if (phone !== null && phone !== undefined) {
    _res = await pool.query(`UPDATE users SET phone = $1 WHERE id = $2 RETURNING *;`, [phone, id]);
  }

  if (password !== null && password !== undefined) {
    _res = await pool.query(`UPDATE users SET password = $1 WHERE id = $2 RETURNING *;`, [password, id]);
  }

  res.status(200).json(_res.rows[0]);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  console.log(`Eliminar Usuario ${id}`);

  const _res = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *;`, [id]);
  res.status(200).json(_res.rows[0]);
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validar que el usuario existe
  const _res = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = _res.rows[0];

  // Validar que la contraseña sea correcta
  if (!verifyPassword(password, user.password)) {
    return res.status(402).json({ message: 'Contraseña incorrecta' });
  }

  delete user.password;

  // Responder info del usuario y token
  return res.status(200).json({ user, token: '1234'});
});

app.listen(PORT, () => {
  console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});