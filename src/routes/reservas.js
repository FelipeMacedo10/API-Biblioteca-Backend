const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.post('/', async (req, res) => {
  const { usuario_id, livro_id, data_retirada } = req.body; try {
    pool.query(
      'INSERT INTO reservas (usuario_id, livro_id, data_retirada) VALUES (?, ?, ?)',
      [usuario_id, livro_id, data_retirada]);
    await pool.query(
      'UPDATE livros SET disponivel = 0 WHERE id = ?',
      [livro_id]);
    res.status(201).json({ mensagem: 'Reserva criada com sucesso!' });
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).json({ mensagem: 'Erro ao criar reserva.' });
  }
});
router.get('/usuario/:usuario_id', async (req, res) => {
  const { usuario_id } = req.params;
  const [rows] = await pool.query(
    'SELECT * FROM reservas WHERE usuario_id = ? ORDER BY id DESC',
    [usuario_id]
  );
  res.json(rows);
});

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM reservas ORDER BY id DESC');
  res.json(rows);
});

module.exports = router;
