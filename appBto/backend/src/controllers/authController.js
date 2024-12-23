const jwt = require('jsonwebtoken');
const db = require('../models');
const { User } = db;

const authController = {
  async register(req, res) {
    try {
      const { email, password, role } = req.body;
      console.log('Register attempt:', { email, role });

      // Check for existing user
      const existingUser = await User.findOne({ 
        where: { email },
        attributes: ['id', 'email'],
        raw: true
      });

      if (existingUser) {
        console.log('Registration failed - Email already exists:', email);
        return res.status(400).json({
          message: 'Email already registered'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password, // In production, hash the password before saving
        role
      });

      console.log('User registered successfully:', user.id);

      // Generate token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async login(req, res) {
    try {
      console.log('Login attempt:', req.body);
      const { email, password } = req.body;
      
      const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'email', 'password', 'role'],
        raw: true
      });
      
      console.log('Database query result:', user);

      if (!user) {
        console.log('User not found with email:', email);
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      console.log('Comparing passwords:', {
        provided: password,
        stored: user.password
      });

      if (password !== user.password) {
        console.log('Password mismatch');
        return res.status(401).json({
          message: 'Invalid email or password'
        });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      console.log('Generated token:', token);

      res.json({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController; 