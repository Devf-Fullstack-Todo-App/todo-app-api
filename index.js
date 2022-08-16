require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5050;

app.use(cors());
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


app.get('/todos/:id', async (req, res) => {
    const { id: todoId } = req.params;
    const response = await pool.query('SELECT * FROM todos WHERE id = $1'[todoId])
    console.log('Leer la tarea tarea ' + id);
    res.status(200).send(response.rows[0])
});

app.get('/todos', async (req, res) => {
    console.log('Leer lista de tareas');
    const response = await pool.query('SELECT * FROM todos')
    res.status(200).send(response.rows)
});


app.patch('/todos/:id', async (req, res) => {
    const { id: todoId } = await req.params;
    const { todo } = req.body
    console.log(`Actualizar la tarea ${todoId}`);
    const response = await pool.query('UPDATE todos todo = $1 WHERE id = $2,'[todo, todoId])
    res.status(200).send(response.rows[0])
});


app.delete('/todos/:id', (req, res) => {
    const { id: todoId } = await req.params;
    const { todo } = req.body
    console.log(`Borrar la tarea ${todoId}`);
    const response = await pool.query('DELETE FROM todos WHERE todo = $1', [todo, todoId])
    res.status(200).send(response.rows[0])
});

app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en http://localhost:${PORT}`);
});