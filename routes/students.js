const express = require('express');
const { Student } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'teacher') {
      where.teacher_id = req.user.id;
    } else if (req.user.role === 'parent' && req.user.student_id) {
      where.id = req.user.student_id;
    }

    const students = await Student.findAll({
      where,
      order: [['created_at', 'DESC']]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticateToken, requireRole('admin', 'teacher'), async (req, res) => {
  const { full_name, national_id, father_national_id, phone, age, birth_date, last_memorization, level, teacher_id } = req.body;
  if (!full_name || !national_id) return res.status(400).json({ error: 'Name and national ID required' });

  try {
    let tid = teacher_id;
    let tname = '';
    if (req.user.role === 'teacher') {
      tid = req.user.id;
      tname = req.user.name;
    }

    const student = await Student.create({
      full_name, national_id,
      father_national_id: father_national_id || '',
      phone: phone || '',
      age: age || null,
      birth_date: birth_date || null,
      last_memorization: last_memorization || '',
      level: level || '',
      teacher_id: tid || null,
      teacher_name: tname,
      attendance: {},
      exam_status: 'none',
      exam_request: null,
      exam_result: null
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticateToken, requireRole('admin', 'teacher'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (req.user.role === 'teacher' && student.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your student' });
    }

    const allowed = ['full_name','national_id','father_national_id','phone','age','birth_date','last_memorization','level','teacher_id','attendance','exam_status','exam_request','exam_result'];
    const payload = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) payload[key] = updates[key];
    }

    if (updates.teacher_id) {
      const { User } = require('../models');
      const teacher = await User.findByPk(updates.teacher_id, { attributes: ['name'] });
      if (teacher) payload.teacher_name = teacher.name;
    }

    await student.update(payload);
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticateToken, requireRole('admin', 'teacher'), async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    if (req.user.role === 'teacher' && student.teacher_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your student' });
    }
    await student.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
