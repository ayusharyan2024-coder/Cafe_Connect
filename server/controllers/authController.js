const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mockData = require('../mockData');

const authController = {
    signup: async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = mockData.users.find(u => u.email === email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: mockData.getNextUserId(),
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.users.push(newUser);

            // Generate JWT token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email, role: newUser.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Find user
            const user = mockData.users.find(u => u.email === email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = authController;
