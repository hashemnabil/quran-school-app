const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'name', 'avatar', 'student_id'],
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const { name, username, password, role, student_id } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username, password: hashedPassword, role, name,
      student_id: student_id || null
    });
    res.status(201).json({
      id: user.id, username: user.username, role: user.role,
      name: user.name, avatar: user.avatar, student_id: user.student_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, password, avatar } = req.body;
  if (req.user.id !== id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (password) updates.password = await bcrypt.hash(password, 10);

    if (Object.keys(updates).length === 0) return res.status(400).json({ error: 'No fields to update' });

    await user.update(updates);
    res.json({
      id: user.id, username: user.username, role: user.role,
      name: user.name, avatar: user.avatar, student_id: user.student_id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
