const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT id, nome, email, tipo FROM usuarios');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { nome, email, senha, tipo = 'USER' } = req.body;
  await pool.query(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senha, tipo]
  );
  res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuarios WHERE id=?', [id]);
  res.status(204).send();
});

module.exports = router;
