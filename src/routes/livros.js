const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM livros');
  res.json(rows);
});

router.get('/buscar', async (req, res) => {
  const { q, autor, genero } = req.query;
  let sql = 'SELECT * FROM livros WHERE 1=1';
  const params = [];

  if (q) { sql += ' AND titulo LIKE ?'; params.push(`%${q}%`); }
  if (autor) { sql += ' AND autor LIKE ?'; params.push(`%${autor}%`); }
  if (genero) { sql += ' AND genero = ?'; params.push(genero); }

  const [rows] = await pool.query(sql, params);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { titulo, autor, genero, descricao } = req.body;
  await pool.query(
    'INSERT INTO livros (titulo, autor, genero, descricao) VALUES (?, ?, ?, ?)',
    [titulo, autor, genero, descricao]
  );
  res.status(201).json({ mensagem: 'Livro cadastrado com sucesso!' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, genero, descricao, disponivel } = req.body;
  await pool.query(
    'UPDATE livros SET titulo=?, autor=?, genero=?, descricao=?, disponivel=? WHERE id=?',
    [titulo, autor, genero, descricao, disponivel, id]
  );
  res.json({ mensagem: 'Livro atualizado com sucesso!' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM livros WHERE id=?', [id]);
  res.status(204).send();
});

module.exports = router;
