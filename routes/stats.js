const express = require('express');
const { User, Student } = require('../models');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const [totalStudents, totalTeachers, pendingExams, doneExams] = await Promise.all([
      Student.count(),
      User.count({ where: { role: 'teacher' } }),
      Student.count({ where: { exam_status: 'pending' } }),
      Student.count({ where: { exam_status: 'done' } })
    ]);
    res.json({ totalStudents, totalTeachers, pendingExams, doneExams });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
