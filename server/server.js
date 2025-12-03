const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const addItemsRoutes = require('./routes/addItems');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', addItemsRoutes);

// Start server immediately (no database sync needed)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} with MOCK DATA (no database)`);
    console.log('Mock users: admin@cafe.com / admin123, user@test.com / user123');
});
