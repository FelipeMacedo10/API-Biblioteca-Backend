const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  const [rows] = await pool.query(`
    SELECT c.id, l.titulo, l.autor, l.genero
    FROM carrinho c
    JOIN livros l ON c.livro_id = l.id
    WHERE c.usuario_id = ?
  `, [usuario_id]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { usuario_id, livro_id } = req.body;
  await pool.query('INSERT INTO carrinho (usuario_id, livro_id) VALUES (?, ?)', [usuario_id, livro_id]);
  res.status(201).json({ mensagem: 'Livro adicionado ao carrinho' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM carrinho WHERE id = ?', [id]);
  res.status(204).send();
});

module.exports = router;