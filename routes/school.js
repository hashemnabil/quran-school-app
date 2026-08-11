const express = require('express');
const { School } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let school = await School.findByPk(1);
    if (!school) {
      school = await School.create({ id: 1 });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', authenticateToken, requireRole('admin'), async (req, res) => {
  const { name, tagline, logo, phone, whatsapp, facebook, instagram, whatsapp_group } = req.body;
  try {
    let school = await School.findByPk(1);
    if (!school) {
      school = await School.create({ id: 1, name, tagline, logo, phone, whatsapp, facebook, instagram, whatsapp_group });
    } else {
      await school.update({ name, tagline, logo, phone, whatsapp, facebook, instagram, whatsapp_group });
    }
    res.json(school);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
