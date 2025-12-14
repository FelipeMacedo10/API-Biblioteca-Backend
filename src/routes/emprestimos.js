const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { usuario_id, livro_id, data_inicio, data_fim } = req.body;

  await pool.query('UPDATE livros SET disponivel = FALSE WHERE id = ?', [livro_id]);

  await pool.query(
    'INSERT INTO emprestimos (usuario_id, livro_id, data_inicio, data_fim, devolvido) VALUES (?, ?, ?, ?, FALSE)',
    [usuario_id, livro_id, data_inicio, data_fim]
  );

  res.status(201).json({ mensagem: 'Empréstimo criado com sucesso!' });
});

router.post('/:id/devolver', async (req, res) => {
  const { id } = req.params;

  const [rows] = await pool.query('SELECT livro_id FROM emprestimos WHERE id = ?', [id]);
  const emprestimo = rows[0];
  if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado' });

  await pool.query('UPDATE emprestimos SET devolvido = TRUE WHERE id = ?', [id]);
  await pool.query('UPDATE livros SET disponivel = TRUE WHERE id = ?', [emprestimo.livro_id]);

  res.json({ mensagem: 'Devolução registrada com sucesso!' });
});

router.get('/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM emprestimos WHERE usuario_id = ? ORDER BY id DESC',
    [usuario_id]
  );
  res.json(rows);
});

module.exports = router;
