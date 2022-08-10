const express = require('express');
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  console.log('Se ejecutó la ruta base');
  res.send('El servidor esta corriendo 🚀');
});

// C - Create Todos
app.post('/todos', (req, res) => {
  console.log('Crear tarea ✅');

  // Proceso de crear una tarea

  res.send('Se creó la tarea con éxito! 🚀');
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
