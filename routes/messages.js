const express = require('express');
const { Message } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  const { channel, with: withUser } = req.query;
  try {
    const where = {};
    if (channel) {
      where.channel = channel;
    }
    if (withUser) {
      where.channel = 'dm:' + [req.user.id, withUser].sort().join('_');
    }

    const messages = await Message.findAll({
      where,
      order: [['created_at', 'ASC']]
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const { channel, recipient_id, recipient_name, text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  try {
    const time = new Date().toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    let finalChannel = channel || 'group';
    let finalRecipient = recipient_id || null;
    let finalRecipientName = recipient_name || null;

    if (recipient_id) {
      finalChannel = 'dm:' + [req.user.id, recipient_id].sort().join('_');
      if (!recipient_name) {
        const { User } = require('../models');
        const other = await User.findByPk(recipient_id, { attributes: ['name'] });
        if (other) finalRecipientName = other.name;
      }
    }

    const msg = await Message.create({
      channel: finalChannel,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_role: req.user.role,
      recipient_id: finalRecipient,
      recipient_name: finalRecipientName,
      text,
      time
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
