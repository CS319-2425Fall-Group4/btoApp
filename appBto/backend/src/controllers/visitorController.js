const { Visitor, Student, Visit, TimeSlot } = require('../models');

const visitorController = {
  // Create a new visitor with students and visit details
  async createVisitor(req, res) {
    try {
      const { email, phone_number, students, visit } = req.body;
      
      const visitor = await Visitor.create({
        email,
        phone_number
      });

      if (students && students.length > 0) {
        await Promise.all(
          students.map(student => 
            Student.create({
              visitor_id: visitor.id,
              name: student.name,
              interests: student.interests
            })
          )
        );
      }

      if (visit) {
        const newVisit = await Visit.create({
          visitor_id: visitor.id,
          school_id: visit.school_id,
          visit_date: visit.visit_date
        });

        if (visit.time_slots && visit.time_slots.length > 0) {
          await Promise.all(
            visit.time_slots.map(slot =>
              TimeSlot.create({
                visit_id: newVisit.id,
                slot_time: slot.time
              })
            )
          );
        }
      }

      res.status(201).json(visitor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all visitors
  async getAllVisitors(req, res) {
    try {
      const visitors = await Visitor.findAll({
        include: [
          { model: Student },
          { 
            model: Visit,
            include: [TimeSlot]
          }
        ]
      });
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get visitor by ID
  async getVisitorById(req, res) {
    try {
      const visitor = await Visitor.findByPk(req.params.id, {
        include: [
          { model: Student },
          { 
            model: Visit,
            include: [TimeSlot]
          }
        ]
      });
      if (!visitor) {
        return res.status(404).json({ message: 'Visitor not found' });
      }
      res.json(visitor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = visitorController;