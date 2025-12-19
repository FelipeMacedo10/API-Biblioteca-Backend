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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM livros WHERE id = ?', [id]);
  
  if (rows.length === 0) {
    return res.status(404).json({ mensagem: 'Livro não encontrado' });
  }

  res.json(rows[0]);
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

// Tornar livro disponível novamente
router.put('/:id/disponivel', async (req, res) => {
  const { id } = req.params;
  console.log('📩 Requisição recebida para tornar livro disponível');
  console.log('➡️ ID recebido:', id);

  try {
    const [result] = await pool.query(
      'UPDATE livros SET disponivel = 1 WHERE id = ?',
      [id]
    );

    console.log('🛠 Resultado do UPDATE:', result);

    if (result.affectedRows === 0) {
      console.warn('⚠️ Nenhum livro encontrado com esse ID');
      return res.status(404).json({ mensagem: 'Livro não encontrado.' });
    }

    console.log('✅ Livro atualizado com sucesso, ID:', id);
    res.json({ mensagem: 'Livro marcado como disponível novamente.' });
  } catch (err) {
    console.error('❌ Erro ao atualizar livro:', err);
    res.status(500).json({ mensagem: 'Erro ao atualizar livro.' });
  }
});




module.exports = router;
