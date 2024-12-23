const { Student, Visitor } = require('../models');

const studentController = {
  // Create a new student
  async createStudent(req, res) {
    try {
      const student = await Student.create(req.body);
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all students
  async getAllStudents(req, res) {
    try {
      const students = await Student.findAll({ 
          model: Visitor,
          as: 'applicant'
      });
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get student by ID
  async getStudentById(req, res) {
    try {
      const student = await Student.findByPk(req.params.id, {
          model: Visitor,
          as: 'applicant'
      });
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update student
  async updateStudent(req, res) {
    try {
      const student = await Student.findByPk(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      await student.update(req.body);
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = studentController;