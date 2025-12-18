const express = require('express');
const cors = require('cors');

const livrosRoutes = require('./routes/livros');
const usuariosRoutes = require('./routes/usuarios');
const reservasRoutes = require('./routes/reservas');
const emprestimosRoutes = require('./routes/emprestimos');
const carrinhoRoutes = require('./routes/carrinho');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/livros', livrosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/emprestimos', emprestimosRoutes);
app.use('/carrinho', carrinhoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
