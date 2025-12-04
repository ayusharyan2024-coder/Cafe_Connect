const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
    signup: async (req, res) => {
        console.log('Signup request received:', req.body); // DEBUG LOG
        try {
            const { name, email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log('User already exists:', email); // DEBUG LOG
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const user = new User({
                name,
                email,
                password,
                role: role || 'user'
            });
            const savedUser = await user.save();
            console.log('User saved successfully:', savedUser); // DEBUG LOG

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'User created successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    restaurantId: user.restaurantId,
                },
            });
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    login: async (req, res) => {
        console.log('Login request received:', req.body); // DEBUG LOG
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email });
            console.log('User found:', user ? user.email : 'NOT FOUND'); // DEBUG LOG
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            console.log('Comparing password...'); // DEBUG LOG
            const isMatch = await user.comparePassword(password);
            console.log('Password match:', isMatch); // DEBUG LOG
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '7d' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    restaurantId: user.restaurantId,
                },
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
};

module.exports = authController;
